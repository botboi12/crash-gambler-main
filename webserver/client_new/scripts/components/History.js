define(["react", "game-logic/clib", "game-logic/engine"], function (
  React,
  Clib,
  Engine
) {
  /** Constants **/
  var MAX_GAMES_SHOWED = 12;

  var D = React.DOM;

  function getState() {
    return {
      engine: Engine,
    };
  }

  return React.createClass({
    displayName: "history",

    getInitialState: function () {
      return getState();
    },

    componentDidMount: function () {
      Engine.on({
        game_crash: this._onChange,
      });
    },

    componentWillUnmount: function () {
      Engine.off({
        game_crash: this._onChange,
      });
    },

    _onChange: function () {
      //Check if its mounted because when Game view receives the disconnect event from EngineVirtualStore unmounts all views
      //and the views unregister their events before the event dispatcher dispatch them with the disconnect event
      if (this.isMounted()) this.setState(getState());
    },

    render: function () {
      var self = this;

      var cols = self.state.engine.tableHistory
        .slice(0, MAX_GAMES_SHOWED)
        .map(function (game, i) {
          var className;
          if (game.game_crash >= 198) className = "games-log-goodcrash";
          else if (game.game_crash <= 196) className = "games-log-badcrash";
          else className = "";

          return D.td(
            { key: "game_" + i },
            D.a(
              {
                href: "/game/" + game.game_id,
                target: "_blank",
                className: className,
              },
              Clib.formatDecimals(game.game_crash / 100),
              D.i(null, "x")
            )
          );
        });

      return D.table({ className: "history" }, D.tbody(null, D.tr(null, cols)));
    },
  });
});
