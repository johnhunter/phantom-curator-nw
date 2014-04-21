/** @jsx React.DOM */

module.exports = React.createClass({
    render: function(){
        var style = {
            opacity: this.props.opacity,
            display: 'block'
        };
        return (
            <div className="visual" style={style}>
                <img src={this.props.src} alt={this.props.title} />
            </div>
        );
    }
});
