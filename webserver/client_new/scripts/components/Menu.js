define(["react", "components/PopupFrame", "components/Invest"], function (
  React,
  PopupFrameClass,
  InvestClass
) {
  var D = React.DOM;
  const PopupFrame = React.createFactory(PopupFrameClass);
  const Invest = React.createFactory(InvestClass);

  return React.createClass({
    displayName: "Menu",

    propTypes: {
      loggedIn: React.PropTypes.bool.isRequired,
    },

    getInitialState: function () {
      return { open: false };
    },

    _openSidebar: function () {
      this.setState({ open: true });
    },

    _closeSidebar: function (e) {
      if (e.currentTarget !== e.relatedTarget) {
        // if clicked outside
        this.setState({ open: false });
      }
    },

    render: function () {
      const { loggedIn } = this.props;
      const { open } = this.state;

      return D.div(
        {
          tabIndex: 0,
          onBlur: this._closeSidebar,
          style: {
            outline: "none",
            display: "flex",
          },
        },
        D.div(
          { className: "hamburger", onClick: this._openSidebar },
          [1, 2, 3].map(() => D.div())
        ),
        React.createElement(
          "div",
          {
            className: "sidenav",
            style: {
              width: open ? "min(25rem, 75%)" : 0,
            },
          },
          loggedIn &&
            PopupFrame(
              {
                render: (open) =>
                  React.createElement(
                    "a",
                    {
                      onClick: open,
                    },
                    "House"
                  ),
              },
              Invest()
            ),
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Statistics"
              ),
            src: "/stats",
          }),
          PopupFrame({
            render: (open) =>
              React.createElement(
                "a",
                {
                  onClick: open,
                },
                "Leaderboard"
              ),
            src: "/leaderboard",
          }),
          loggedIn && [
            D.hr({ key: "hr" }),
            PopupFrame({
              render: (open) =>
                React.createElement(
                  "a",
                  {
                    onClick: open,
                  },
                  "Account"
                ),
              src: "/account",
              key: "acc",
            }),
            React.createElement(
              "a",
              {
                key: "logout",
                href: "#",
                onClick: () => {
                  if (confirm("Are you sure you wish to log out?")) {
                    fetch("/logout", { method: "POST" }).then(() => {
                      location.href = "/";
                    });
                  }
                },
              },
              "Logout"
            ),
          ]
        )
      );
    },
  });
});
