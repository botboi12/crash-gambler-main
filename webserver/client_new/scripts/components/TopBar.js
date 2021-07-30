define([
  "react",
  "game-logic/engine",
  "stores/GameSettingsStore",
  "actions/GameSettingsActions",
  "game-logic/clib",
  "components/Menu",
  "components/PopupFrame",
  "components/Invest",
], function (
  React,
  Engine,
  GameSettingsStore,
  GameSettingsActions,
  Clib,
  MenuClass,
  PopupFrameClass,
  InvestClass
) {
  var D = React.DOM;
  const Menu = React.createFactory(MenuClass);
  const PopupFrame = React.createFactory(PopupFrameClass);
  const Invest = React.createFactory(InvestClass);

  function getState() {
    return {
      balanceBitsFormatted: Clib.formatSatoshis(Engine.balanceSatoshis),
      theme: GameSettingsStore.getCurrentTheme(), //black || white
    };
  }

  return React.createClass({
    displayName: "TopBar",

    propTypes: {
      isMobileOrSmall: React.PropTypes.bool.isRequired,
    },

    getInitialState: function () {
      var state = getState();
      state.username = Engine.username;
      state.fullScreen = false;
      return state;
    },

    componentDidMount: function () {
      Engine.on({
        game_started: this._onChange,
        game_crash: this._onChange,
        cashed_out: this._onChange,
      });
      GameSettingsStore.on("all", this._onChange);
    },

    componentWillUnmount: function () {
      Engine.off({
        game_started: this._onChange,
        game_crash: this._onChange,
        cashed_out: this._onChange,
      });
      GameSettingsStore.off("all", this._onChange);
    },

    _onChange: function () {
      this.setState(getState());
    },

    _toggleTheme: function () {
      GameSettingsActions.toggleTheme();
    },

    render: function () {
      var userLogin;
      if (this.state.username) {
        userLogin = D.div(
          { className: "user-login" },
          D.div(
            { className: "balance-bits" },
            D.span(null, "Satoshis: "),
            D.span({ className: "balance" }, this.state.balanceBitsFormatted)
          ),
          D.div(
            { className: "username" },
            D.a({ href: "/account" }, this.state.username)
          )
        );
      } else {
        userLogin = D.div(
          { className: "user-login" },
          D.div(
            { className: "register" },
            D.a({ href: "/register" }, "Register")
          ),
          D.div({ className: "login" }, D.a({ href: "/login" }, "Log in"))
        );
      }

      return D.div(
        { id: "top-bar" },
        D.h1(
          { className: "title" },
          D.a(
            { href: "/" },
            D.h1(null, this.props.isMobileOrSmall ? "retro" : "retrocrash")
          )
        ),
        !this.props.isMobileOrSmall &&
          D.div(
            { className: "tabs" },
            this.state.username &&
              PopupFrame(
                {
                  render: (open) =>
                    React.createElement(
                      "a",
                      {
                        onClick: open,
                      },
                      D.i({ className: "fa fa-bank" }),
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
                  D.i({ className: "fa fa-bar-chart" }),
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
                  D.i({ className: "fa fa-trophy" }),
                  "Leaderboard"
                ),
              src: "/leaderboard",
            }),
            PopupFrame({
              render: (open) =>
                React.createElement(
                  "a",
                  {
                    onClick: open,
                  },
                  D.i({ className: "fa fa-question-circle" }),
                  "Help"
                ),
              src: "/faq",
            })
          ),
        userLogin,
        this.props.isMobileOrSmall &&
          Menu({
            loggedIn: !!this.state.username,
          })
      );
    },
  });
});
