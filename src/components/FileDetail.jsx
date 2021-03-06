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
                <span />
            );
        }
        return (
            <div className="c-FileDetail">
                <nav className="navbar">
                    <button className="pure-button pure-button-primary" onClick={this.props.onSelect} title={isSelected ? 'deselect':'select'}>
                        <span className={isSelected ? 'icon-checkmark':'icon-checkmark2'}></span>
                    </button>
                    <button className="pure-button" onClick={this.handleOpen} title="open folder">
                        <span className="icon-folder-open"></span>
                    </button>
                    <label className="with-inline">
                        ref
                        <input type="range" defaultValue={this.state.opacity} onChange={this.swapImage} />
                        diff
                    </label>
                    <button className="pure-button pull-right" onClick={this.props.onClose} title="close">
                        <span className="icon-close"></span>
                    </button>
                </nav>
                <div className={'visuals ' + (isSelected? 'is-selected':'')}>
                    <FileImage title="Reference image" src={path + '.png'} opacity={1 - this.state.opacity} />
                    <FileImage title="Diff image" src={path + '.diff.png'} opacity={this.state.opacity} />
                </div>
            </div>
        );
    }
});
