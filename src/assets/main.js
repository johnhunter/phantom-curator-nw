(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            selectedState: 'undefined',
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
        e.target.blur();
        return false;
    },
    handlePathUpdate: function(path){
        storage.setItem('diffPath', path);
        this.getFileList(path);
    },
    updateSelectedCount: function(delta){
        var updatedCount = this.state.selectedCount + delta;
        this.setState({
            selectedCount: updatedCount,
            selectedState: 'undefined'
        });
    },
    toggleAll: function(e){
        var update = {};
        if (this.state.selectedState === 'all') {
            update.selectedState = 'none';
            update.selectedCount = 0;
        }
        else {
            update.selectedState = 'all';
            update.selectedCount = this.state.list.length;
        }
        this.setState(update);
        e.target.blur();
        return false;
    },
    render: function() {
        var rebaseBtnClass = 'pure-button pure-button-primary';
        rebaseBtnClass += this.state.selectedCount ? '' : ' pure-button-disabled';
        var isSelectedAll = this.state.selectedState === 'all';
        var selectAllIcon = isSelectedAll ? 'icon-checkmark2' : 'icon-checkmark';

        return (
            React.DOM.form( {className:"c-App", onSubmit:this.handleRebase}, 
                React.DOM.header( {className:"navbar"}, 
                    React.DOM.button( {className:rebaseBtnClass, type:"submit", title:"Rebase selected"}, 
                        React.DOM.span( {className:this.state.selectedCount ? 'icon-remove' : 'icon-remove2' }),
                        React.DOM.span( {className:"count"}, this.state.selectedCount)
                    ),
                    React.DOM.button( {className:"pure-button", onClick:this.toggleAll, title:isSelectedAll ? 'Select all' : 'Select none'}, 
                        React.DOM.span( {className:selectAllIcon}),
                        React.DOM.span( {className:selectAllIcon})
                    ),
                    React.DOM.button( {className:"pure-button", onClick:this.handleRefresh, title:"Refresh"}, 
                        React.DOM.span( {className:"icon-loop"})
                    ),
                    FolderPicker( {path:this.state.path, onSelect:this.handlePathUpdate, title:"Select visual diff folder"}, 
                        React.DOM.span( {className:"icon-folder"})
                    )
                ),

                FileList(
                    {files:this.state.list,
                    path:this.state.path,
                    onChange:this.updateSelectedCount,
                    selectedState:this.state.selectedState} )
            )
        );
    }
});

},{"./FileList.jsx":5,"./FolderPicker.jsx":6}],2:[function(require,module,exports){
/** @jsx React.DOM */

var FileImage = require('./FileImage.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            opacity: 100
        };
    },
    handleOpen: function(e){
        var file = this.props.path.replace(/\//g, pathSep) + '.fail.png';
        gui.Shell.showItemInFolder(file);
        return false;
    },
    swapImage: function(e){
        var value = e.target.value;
        this.setState({ opacity: Math.round(value / 10) / 10 });
        return false;
    },
    render: function(){
        var isSelected = this.props.selected;
        var path = this.props.path;
        if (!this.props.active) {
            return (
                React.DOM.span(null )
            );
        }
        return (
            React.DOM.div( {className:"c-FileDetail"}, 
                React.DOM.nav( {className:"navbar"}, 
                    React.DOM.button( {className:"pure-button pure-button-primary", onClick:this.props.onSelect, title:isSelected ? 'deselect':'select'}, 
                        React.DOM.span( {className:isSelected ? 'icon-checkmark':'icon-checkmark2'})
                    ),
                    React.DOM.button( {className:"pure-button", onClick:this.handleOpen, title:"open folder"}, 
                        React.DOM.span( {className:"icon-folder-open"})
                    ),
                    React.DOM.label( {className:"with-inline"}, 
                        " ref ",
                        React.DOM.input( {type:"range", defaultValue:this.state.opacity, onChange:this.swapImage} ),
                        " diff "
                    ),
                    React.DOM.button( {className:"pure-button pull-right", onClick:this.props.onClose, title:"close"}, 
                        React.DOM.span( {className:"icon-close"})
                    )
                ),
                React.DOM.div( {className:'visuals ' + (isSelected? 'is-selected':'')}, 
                    FileImage( {title:"Reference image", src:path + '.png', opacity:1 - this.state.opacity} ),
                    FileImage( {title:"Diff image", src:path + '.diff.png', opacity:this.state.opacity} )
                )
            )
        );
    }
});

},{"./FileImage.jsx":3}],3:[function(require,module,exports){
/** @jsx React.DOM */

module.exports = React.createClass({
    render: function(){
        var style = {
            opacity: this.props.opacity,
            display: 'block'
        };
        return (
            React.DOM.div( {className:"visual", style:style}, 
                React.DOM.p( {className:"caption"}, this.props.title),
                React.DOM.img( {src:this.props.src} )
            )
        );
    }
});
},{}],4:[function(require,module,exports){
/** @jsx React.DOM */

var FileDetail = require('./FileDetail.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            selected: false
        };
    },
    componentWillReceiveProps: function(nextProps) {
        var selectedState = nextProps.selectedState;
        if (selectedState !== 'undefined') {
            this.setState({
                selected: selectedState === 'all'
            });
        }
    },
    handleSelect: function(e){
        var field = e.target
        this.setSelected(e.target.checked);
    },
    toggleSelect: function(e){
        this.setSelected(!this.state.selected);
        return false;
    },
    setSelected: function(value){
        this.setState({ selected: value });
        this.props.onSelect(value ? 1 : -1);
    },
    toggleDetail: function(e){
        if (this.props.isShowingDetail) {
            this.props.onShowDetail(-1);
            return false;
        }
        this.props.onShowDetail(this.props.index);
        return false;
    },
    render: function() {
        var relpath = this.props.key;
        var abspath = this.props.root + '/' + relpath;
        var failImg = abspath + '.fail.png';

        return (
            React.DOM.li( {className:"c-FileItem"}, 
                React.DOM.label( {className:"with-pill"}, 
                    React.DOM.input( {type:"checkbox", name:"diff", value:relpath, checked:this.state.selected, onChange:this.handleSelect} ),
                    " Select "
                ),
                React.DOM.a( {className:"with-block", href:"#view", title:relpath, onClick:this.toggleDetail}, 
                    React.DOM.img( {src:failImg} )
                ),
                FileDetail( {path:abspath,
                    selected:this.state.selected, onSelect:this.toggleSelect,
                    active:this.props.isShowingDetail, onClose:this.toggleDetail} )
            )
        );
    }
});

},{"./FileDetail.jsx":2}],5:[function(require,module,exports){
/** @jsx React.DOM */

var FileItem = require('./FileItem.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            showingDetailIndex: -1
        };
    },

    showItemDetail: function(index){
        var currIndex = this.state.showingDetailIndex
        if (index === 'next') {
            index = Math.min(currIndex + 1, this.props.files.length - 1);
        }
        if (index === 'prev') {
            index = Math.max(currIndex - 1, 0);
        }
        this.setState({
            showingDetailIndex: index
        });
    },
    render: function(){
        var self = this;
        var fileItems = this.props.files.map(function (filepath, i) {
            return FileItem(
                {key:filepath,
                index:i,
                root:normalisePath(self.props.path),
                onSelect:self.props.onChange,
                onShowDetail:self.showItemDetail,
                isShowingDetail:i === self.state.showingDetailIndex,
                selectedState:self.props.selectedState} );
        });

        if (!fileItems.length) {
            fileItems = React.DOM.li( {className:"empty-msg"}, "No failing diff images found.");
        }

        return (
            React.DOM.ul( {className:"c-FileList"}, 
                fileItems
            )
        );
    }
});

function normalisePath(path){
    return String(path).replace(/\\/g, '/');
}

},{"./FileItem.jsx":4}],6:[function(require,module,exports){
/** @jsx React.DOM */

module.exports = React.createClass({
    handleChange: function(e){
        var button = e.target;
        var self = this;
        var picker = this.refs.picker.getDOMNode();

        picker.files.append(new File(this.props.path, ''));
        $(picker).click().one('change', function(){
            if (this.value) {
                self.props.onSelect(this.value);
            }
            button.blur();
        });
        return false;
    },
    componentDidMount: function(){
        // workaround for JSX not liking nodeWebkit attrs
        var picker = this.refs.picker.getDOMNode();
        picker.setAttribute('nwdirectory', 'nwdirectory');
    },
    render: function() {
        return (
            React.DOM.span( {className:"c-FolderPicker"}, 
                React.DOM.button( {className:"pure-button", id:"folder-select", onClick:this.handleChange}, 
                   this.props.children
                ),
                React.DOM.input( {style:{display:'none'}, type:"file", ref:"picker"} ),
                React.DOM.span( {className:"diff-path"}, this.props.path)
            )
        );
    }
});

},{}],7:[function(require,module,exports){
/** @jsx React.DOM */

var App = require('./App.jsx');

React.renderComponent(
    App(null ),
    document.getElementById('content')
);
},{"./App.jsx":1}]},{},[7])