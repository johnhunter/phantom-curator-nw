/** @jsx React.DOM */

module.exports = React.createClass({
    render: function(){
        var style = {
            opacity: this.props.opacity,
            display: 'block'
        };
        return (
            <div className="visual" style={style}>
                <p className="caption">{this.props.title}</p>
                <img src={this.props.src} />
            </div>
        );
    }
});