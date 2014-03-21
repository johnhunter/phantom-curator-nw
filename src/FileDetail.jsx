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
                    <button className="pure-button pure-button-primary" onClick={this.props.onSelect}>
                        {isSelected ? 'deselect':'select'}
                    </button>
                    <button className="pure-button" onClick={this.handleOpen}>
                        open folder
                    </button>
                    <label className="with-inline">
                        ref
                        <input type="range" defaultValue={this.state.opacity} onChange={this.swapImage} />
                        diff
                    </label>
                    <button className="pure-button pull-right" onClick={this.props.onClose}>
                        close
                    </button>
                </nav>
                <div className={'visuals ' + (isSelected? 'is-selected':'')}>
                    <FileImage title="Reference image" src={path + '.png'} opacity="100" />
                    <FileImage title="Diff image" src={path + '.diff.png'} opacity={this.state.opacity} />
                </div>
            </div>
        );
    }
});