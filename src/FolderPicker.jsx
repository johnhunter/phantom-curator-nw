/** @jsx React.DOM */

module.exports = React.createClass({
    handleChange: function(e){
        e.preventDefault();
        var self = this;
        var picker = this.refs.picker.getDOMNode();

        picker.files.append(new File(this.props.path, ''));
        $(picker).click().one('change', function(e){
            if (this.value) {
                self.props.onSelect(this.value);
            }
        });
    },
    componentDidMount: function(){
        // workaround for JSX not liking nodeWebkit attrs
        var picker = this.refs.picker.getDOMNode();
        picker.setAttribute('nwdirectory', 'nwdirectory');
    },
    render: function() {
        return (
            <span className="c-FolderPicker">
                <button className="pure-button" id="folder-select" onClick={this.handleChange}>
                   {this.props.children}
                </button>
                <input style={{display:'none'}} type="file" ref="picker" />
                <span className="diff-path">{this.props.path}</span>
            </span>
        );
    }
});