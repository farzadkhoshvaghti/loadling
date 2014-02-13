
var chrome = chrome;

function TaskRunner(task) {
  this.url = task.url;
  this.start();
}

TaskRunner.prototype = {
  start: function(){
    this.initListeners();
    chrome.tabs.create({ url: this.url }, function(tab) {
      this.tab = tab;
    }.bind(this));
  },

  initListeners: function(){
    chrome.processes.onUpdatedWithMemory.addListener(this.onProcessesUpdatedWithMemory.bind(this));
    chrome.tabs.onUpdated.addListener(this.onTabsUpdated.bind(this));
  },

  onProcessesUpdatedWithMemory: function(processes){
    if (!this.tab) return;

    var tab = this.tab;

    Object.keys(processes).forEach(function(pid){
      var p = processes[pid];
      if (p.tabs[0] == tab.id) {
        chrome.tabs.get(tab.id, function(tab) {
          console.log(tab);
          console.log(tab.title, (p.privateMemory / 1024 / 1024).toFixed(0) + ' mb', Math.floor(p.cpu) + '%');
        });
      }
    });
    console.log(processes);
  },

  onTabsUpdated: function(tabId, changeInfo, Tab) {
    if (!this.tab) return;
    if (tabId == this.tab.id && changeInfo.status == 'complete') {

    }
  }
};

new TaskRunner({ url: 'http://cssdeck.com/labs/simple-css3-heart-pulsing-animations' });