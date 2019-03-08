port module Main exposing (log, main)

import Platform exposing (worker)


port log : String -> Cmd msg


main =
    worker
        { init = \() -> ( 0, log "Main application initialized" )
        , subscriptions = \_ -> Sub.none
        , update = \msg model -> ( model, Cmd.none )
        }
