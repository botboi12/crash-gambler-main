define([
  "react",
  "game-logic/clib",
  "game-logic/stateLib",
  "lodash",
  "components/BetButton",
  "actions/ControlsActions",
  "stores/ControlsStore",
  "game-logic/engine",
], function (
  React,
  Clib,
  StateLib,
  _,
  BetButtonClass,
  ControlsActions,
  ControlsStore,
  Engine
) {
  var BetButton = React.createFactory(BetButtonClass);

  var D = React.DOM;

  function getState() {
    return {
      betSize: ControlsStore.getBetSize(), //Bet input string in satoshis
      betInvalid: ControlsStore.getBetInvalid(), //false || string error message
      cashOut: ControlsStore.getCashOut(),
      cashOutInvalid: ControlsStore.getCashOutInvalid(), //false || string error message
      engine: Engine,
    };
  }

  return React.createClass({
    displayName: "Controls",

    propTypes: {
      isMobileOrSmall: React.PropTypes.bool.isRequired,
      controlsSize: React.PropTypes.string.isRequired,
    },

    getInitialState: function () {
      return getState();
    },

    componentDidMount: function () {
      ControlsStore.addChangeListener(this._onChange);
      Engine.on({
        game_started: this._onChange,
        game_crash: this._onChange,
        game_starting: this._onChange,
        player_bet: this._onChange,
        cashed_out: this._onChange,
        placing_bet: this._onChange,
        bet_placed: this._onChange,
        bet_queued: this._onChange,
        cashing_out: this._onChange,
        cancel_bet: this._onChange,
      });
    },

    componentWillUnmount: function () {
      ControlsStore.removeChangeListener(this._onChange);
      Engine.off({
        game_started: this._onChange,
        game_crash: this._onChange,
        game_starting: this._onChange,
        player_bet: this._onChange,
        cashed_out: this._onChange,
        placing_bet: this._onChange,
        bet_placed: this._onChange,
        bet_queued: this._onChange,
        cashing_out: this._onChange,
        cancel_bet: this._onChange,
      });
    },

    _onChange: function () {
      if (this.isMounted()) this.setState(getState());
    },

    _placeBet: function () {
      var bet = StateLib.parseBet(this.state.betSize);
      var cashOut = StateLib.parseCashOut(this.state.cashOut);
      ControlsActions.placeBet(bet, cashOut);
    },

    _cancelBet: function () {
      ControlsActions.cancelBet();
    },

    _cashOut: function () {
      ControlsActions.cashOut();
    },

    _setBetSize: function (betSize) {
      ControlsActions.setBetSize(betSize);
    },

    _setAutoCashOut: function (autoCashOut) {
      ControlsActions.setAutoCashOut(autoCashOut);
    },

    _redirectToLogin: function () {
      window.location = "/login";
    },

    render: function () {
      var self = this;

      var isPlayingOrBetting =
        StateLib.isBetting(Engine) ||
        (Engine.gameState === "IN_PROGRESS" &&
          StateLib.currentlyPlaying(Engine));

      // If they're not logged in, let just show a login to play
      if (!Engine.username)
        return D.div(
          { id: "controls-inner-container" },
          D.div(
            { className: "login-button-container" },
            D.button(
              {
                className: "login-button bet-button",
                onClick: this._redirectToLogin,
              },
              "Login to play"
            )
          ),
          D.div(
            { className: "register-container" },
            D.a({ className: "register", href: "/register" }, "or register ")
          )
        );

      /** Control Inputs: Bet & AutoCash@  **/
      //var controlInputs = [], betContainer
      var betContainer = D.div(
        { className: "bet-container", key: "ci-1" },

        D.div(
          {
            className:
              "bet-input-group" + (this.state.betInvalid ? " error" : ""),
          },
          D.span({ className: "" }, "Bet"),
          D.input({
            type: "text",
            name: "bet-size",
            value: self.state.betSize,
            disabled: isPlayingOrBetting,
            onChange: function (e) {
              self._setBetSize(e.target.value);
            },
          }),
          D.span({ className: "" }, "satoshis")
        )
      );
      var autoCashContainer = D.div(
        { className: "autocash-container", key: "ci-2" },

        D.div(
          {
            className:
              "bet-input-group" + (this.state.cashOutInvalid ? " error" : ""),
          },
          D.span({ className: "" }, "Auto Cash Out"),
          D.input({
            min: 1,
            step: 0.01,
            value: self.state.cashOut,
            type: "number",
            name: "cash-out",
            disabled: isPlayingOrBetting,
            onChange: function (e) {
              self._setAutoCashOut(e.target.value);
            },
          }),
          D.span({ className: "" }, "x")
        )
      );

      var controlInputs;
      if (this.props.isMobileOrSmall || this.props.controlsSize === "small") {
        controlInputs = D.div(
          { className: "control-inputs-container" },
          D.div({ className: "input-control" }, betContainer),

          D.div({ className: "input-control" }, autoCashContainer)
        );
      } else {
        controlInputs = [];

        controlInputs.push(
          D.div(
            { className: "input-control controls-row", key: "coi-1" },
            betContainer
          )
        );

        controlInputs.push(
          D.div(
            { className: "input-control controls-row", key: "coi-2" },
            autoCashContainer
          )
        );
      }

      //If the user is logged in render the controls
      return D.div(
        { id: "controls-inner-container", className: this.props.controlsSize },

        controlInputs,

        D.div(
          { className: "button-container" },
          BetButton({
            engine: this.state.engine,
            placeBet: this._placeBet,
            cancelBet: this._cancelBet,
            cashOut: this._cashOut,
            isMobileOrSmall: this.props.isMobileOrSmall,
            betSize: this.state.betSize,
            betInvalid: this.state.betInvalid,
            cashOutInvalid: this.state.cashOutInvalid,
            controlsSize: this.props.controlsSize,
          })
        )
      );
    },
  });
});
