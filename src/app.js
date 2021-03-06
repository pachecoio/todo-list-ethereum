App = {
  contracts: {},
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
  },
  loadAccount: async () => {
    const accounts = await web3.eth.getAccounts();
    App.account = accounts[0];
  },
  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(App.web3Provider)
    App.todoList = await App.contracts.TodoList.deployed();
  },
  render: async () => {
    console.log('render app', App.account)
    if (App.loading) {
      return
    }

    App.setLoading(true)

    $('#account').html(App.account)
    await App.renderTasks();

    App.setLoading(false);
  },
  setLoading: (isLoading) => {
    App.loading = isLoading;
    const loader = $('#loader')
    const content = $('#content')

    if (isLoading) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },
  renderTasks: async () => {
    console.log('render tasks')
    const count = await App.todoList.taskCount();
    const $taskTemplate = $('.taskTemplate')

    for (let i = 1; i <= count; i++) {
      const task = await App.todoList.tasks(i)
      const id = task[0].toNumber();
      const content = task[1];
      const completed = task[2];

      const $newTaskTemplate = $taskTemplate.clone();

      $newTaskTemplate.find('.content').html(content)
      $newTaskTemplate.find('input')
        .prop('name', id)
        .prop('checked', completed)
        .on('click', App.toggleCompleted)

      if(completed) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      $newTaskTemplate.show();
    }
  },
  toggleCompleted: async (e) => {
    App.setLoading(true);
    const taskId = e.target.name;
    console.log('change completed', taskId)
    await App.todoList.changeCompleted(taskId, {from: App.account})
    App.setLoading(false)
  },
  createTask: async () => {
    App.setLoading(true);
    const content = $('#newTask').val();
    console.log('Create new task with content: ', content)
    await App.todoList.createTask(content, {from: App.account});
    window.location.reload();
  },
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  loadWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider
      web3 = new Web3(web3.currentProvider)
    } else {
      window.alert('Please connect to Metamask.')
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum)
      try {
        // Request account access if needed
        await ethereum.enable()
        // Acccounts now exposed
        web3.eth.sendTransaction({
          /* ... */
        })
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider
      window.web3 = new Web3(web3.currentProvider)
      // Acccounts always exposed
      web3.eth.sendTransaction({
        /* ... */
      })
    }
    // Non-dapp browsers...
    else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  },
}

$(() => {
  $(window).load(async () => {
    App.load()
  })
})
