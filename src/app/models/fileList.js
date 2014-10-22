/* globals require, module */

var FileDetailModel = require('./FileDetail');


var model = {};

function FileListModel (path, fileList){
    var self = this;
    self.path = path;
    self.fileList = fileList;
    self.activeItem = null;
    self.selectedCount = 0;
    self.items = fileList.map(function (filepath, i) {
        return new FileDetailModel(filepath, self);
    });
}

var proto = FileListModel.prototype;

proto.getDetailItem = function(){};

proto.updateSelectedCount = function(){
    var items = this.items;
    var i = items.length
    while (i--) {
        this.selectedCount += items[i].isSelected ? 1 : 0;
    }
};
proto.updateActiveItem = function(){
    var items = this.items;
    var i = items.length
    this.activeItem = null;
    while (i--) {
        if (items[i].isActive) {
            this.activeItem = items[i];
            return;
        }
    }
};


module.exports = {
    create: function(path, fileList){
        model = new  FileListModel(path, fileList);
        return model;
    },
    getList: function(){
        return model;
    }
};
