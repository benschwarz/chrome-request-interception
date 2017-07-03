const CRI = require('chrome-remote-interface')
const ChromeLauncher = require('chrome-launcher')

const go = async () => {
  const Chrome = await ChromeLauncher.launch({
    port: 9222
  })

  const devtools = await CRI()
  const { Page, Network } = devtools

  await Promise.all([
    Page.enable(),
    Network.enable()
  ])

  await Network.enableRequestInterception({ enabled: true })

  await Page.navigate({ url: 'https://calibreapp.com' })

  Network.requestIntercepted(() => {
    console.log(arguments)
  })

  devtools.on('event', message => {
    if (message.method === 'Network.enableRequestInterception') console.log(message)
  })

  Page.loadEventFired(() => Chrome.kill())
}

go()
