var tabItems = document.querySelectorAll('.tab-item');
var tabPanes = document.querySelectorAll('.tab-pane');

var line = document.querySelector('.line');
var activeTab = document.querySelector('.tab-item.active');

tabItems.forEach(function(tabItem, index) {
    var tabPane = tabPanes[index]
    tabItem.onclick = function() {
        document.querySelector('.tab-item.active').classList.remove('active'); 
        document.querySelector('.tab-pane.active').classList.remove('active'); 
        tabItem.classList.add('active');
        tabPane.classList.add('active');
        line.style.left = this.offsetLeft + 'px';
        line.style.width = this.offsetWidth + 'px';
        
    }
})


