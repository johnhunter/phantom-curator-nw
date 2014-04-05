/** @jsx React.DOM */

var FolderPicker = require('./FolderPicker.jsx');
var FileList     = require('./FileList.jsx');
var storage      = window.localStorage;


module.exports = React.createClass({
    getInitialState: function() {
        var path = storage.getItem('diffPath') || '';
        this.getFileList(path);
        return {
            path: path,
            list: [],
            selectedCount: 0
        };
    },
    getFileList: function(path){
        var self = this;
        if (!path) { return; }
        visdiffer.setRoot(path).getlist(function(list){
            self.setState({
                path: path,
                list: list
            });
        });
    },
    handleRebase: function(e){
        var self = this;
        // use jquery form methods for the moment
        var $filelist = $(e.target);
        var rebaseList = [];

        $filelist.serializeArray().forEach(function(item){
            if (item.name === 'diff') {
                rebaseList.push(item.value);
            }
        });
        if (rebaseList.length) {
            if (!confirm('Are you sure you want overwrite the reference images?')) {
                return false;
            }
            visdiffer.rebase(rebaseList, function(){
                self.getFileList(this.state.path);
            });
        }
        return false;
    },
    handleRefresh: function(e){
        this.getInitialState();
        return false;
    },
    handlePathUpdate: function(path){
        storage.setItem('diffPath', path);
        this.getFileList(path);

    },
    updateSelectedCount: function(delta){
        var updatedCount = this.state.selectedCount + delta;
        this.setState({ selectedCount: updatedCount });
    },
    render: function() {
        var rebaseBtnClass = 'pure-button pure-button-primary';
        rebaseBtnClass += this.state.selectedCount ? '' : ' pure-button-disabled';

        return (
            <form className="c-App" onSubmit={this.handleRebase}>
                <header className="navbar">
                    <button className={rebaseBtnClass} type="submit" title="Rebase selected">
                        <span className={this.state.selectedCount ? 'icon-remove' : 'icon-remove2' }></span>
                        <span className="count">{this.state.selectedCount}</span>
                    </button>
                    <button className="pure-button" onClick={this.handleRefresh} title="Refresh">
                        <span className="icon-loop"></span>
                    </button>
                    <FolderPicker path={this.state.path} onSelect={this.handlePathUpdate} title="Select visual diff folder">
                        <span className="icon-folder"></span>
                    </FolderPicker>
                </header>
                <FileList files={this.state.list} path={this.state.path} onChange={this.updateSelectedCount} />
            </form>
        );
    }
});
