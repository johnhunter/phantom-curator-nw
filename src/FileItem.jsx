/** @jsx React.DOM */

var FileDetail = require('./FileDetail.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            selected: false,
            showingDetail: false
        };
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
        this.setState({ showingDetail: !this.state.showingDetail });
        return false;
    },
    render: function() {
        var relpath = this.props.filepath;
        var abspath = this.props.root + '/' + relpath;
        var failImg = abspath + '.fail.png';

        return (
            <li className="c-FileItem">
                <label className="with-pill">
                    <input type="checkbox" name="diff" value={relpath} checked={this.state.selected} onChange={this.handleSelect} />
                    Select
                </label>
                <a className="with-block" href="#view" title={relpath} onClick={this.toggleDetail}>
                    <img src={failImg} />
                </a>
                <FileDetail path={abspath}
                    selected={this.state.selected} onSelect={this.toggleSelect}
                    active={this.state.showingDetail} onClose={this.toggleDetail} />
            </li>
        );
    }
});