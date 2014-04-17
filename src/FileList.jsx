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
            return <FileItem
                key={filepath}
                index={i}
                root={normalisePath(self.props.path)}
                onSelect={self.props.onChange}
                onShowDetail={self.showItemDetail}
                isShowingDetail={i === self.state.showingDetailIndex}
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
