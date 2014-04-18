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
            <li className="c-FileItem">
                <label className="with-pill">
                    <input type="checkbox" name="diff" value={relpath} checked={this.state.selected} onChange={this.handleSelect} />
                    {relpath}
                </label>
                <a className="with-block" href="#view" title={relpath} onClick={this.toggleDetail}>
                    <img src={failImg} />
                </a>
                <FileDetail path={abspath}
                    selected={this.state.selected} onSelect={this.toggleSelect}
                    active={this.props.isShowingDetail} onClose={this.toggleDetail} />
            </li>
        );
    }
});
