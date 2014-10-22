/* globals require, module */

function FileDetailModel (filePath, listModel){
    this.listModel = listModel;
    this.filePath = filePath;
    this.isSelected = false;
    this.isActive = false;
}

var proto = FileDetailModel.prototype;

proto.toggleActive = function (value) {
    if (typeof value !== 'boolean') {
        value = !this.isActive;
    }
    this.isActive = value;
    this.listModel.activeItem = this;// TODO use an event!!
}

proto.toggleSelected = function (value) {
    if (typeof value !== 'boolean') {
        value = !this.isSelected;
    }
    this.isSelected = value;
    this.listModel.updateSelectedCount();// TODO use an event!!
}

module.exports = FileDetailModel;
