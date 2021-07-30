define(["react"], function (React) {
  var D = React.DOM;

  return React.createClass({
    displayName: "Menu",

    getInitialState: function () {
      return { open: false };
    },

    _open: function () {
      this.setState({ open: true });
    },

    _close: function (e) {
      if (e.currentTarget !== e.relatedTarget) {
        // if clicked outside
        this.setState({ open: false });
      }
    },

    render: function () {
      const { open } = this.state;
      const { src, children, render } = this.props;

      return D.div(
        null,
        render(this._open),
        D.div({ className: `modal-overlay ${!open && "closed"}` }),
        D.div(
          { className: `modal ${!open && "closed"}` },
          D.button({ className: "close", onClick: this._close }, "\u2715"),
          open &&
            (src
              ? D.iframe({ className: "modal-guts", src })
              : D.div({ className: "modal-guts" }, children))
        )
      );
    },
  });
});
