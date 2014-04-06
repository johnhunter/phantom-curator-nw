/** @jsx React.DOM */

var FileItem = require('./FileItem.jsx');

module.exports = React.createClass({
    render: function(){
        var self = this;
        var fileItems = this.props.files.map(function (filepath) {
            return <FileItem
                key={filepath}
                filepath={filepath}
                root={normalisePath(self.props.path)}
                onSelect={self.props.onChange}
                selectedState={self.props.selectedState} />;
        });

        if (!fileItems.length) {
            fileItems = <li className="empty-msg">No failing diff images found.</li>;
        }

        return (
            <ul className="c-FileList">
                {fileItems}
            </ul>
        );
    }
});

function normalisePath(path){
    return String(path).replace(/\\/g, '/');
}
