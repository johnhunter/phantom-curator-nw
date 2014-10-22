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

        var pathTokens = this.props.key.split('/');

        var visualName = pathTokens.pop();
        var testName = pathTokens.pop();
        var sectionName = pathTokens.pop();

        return (
            <li className="c-FileItem email-item pure-g">

                <div className="pure-u">
                    <img className="email-avatar" height="64" width="64" src={failImg} alt={relpath} />
                </div>

                <div className="pure-u-3-4">
                    <h4 className="email-subject">
                        <a href="#view" className="with-block" onClick={this.toggleDetail}>
                            {visualName}
                        </a>
                    </h4>
                    <label>
                        <input type="checkbox" name="diff" value={relpath} checked={this.state.selected} onChange={this.handleSelect} />
                        Select
                    </label>
                </div>

                <FileDetail path={abspath}
                    selected={this.state.selected} onSelect={this.toggleSelect}
                    active={this.props.isShowingDetail} onClose={this.toggleDetail} />
            </li>
        );
    }
});
