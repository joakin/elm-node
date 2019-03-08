module MainWithJs exposing (main)

import Main exposing (log)
import Platform exposing (worker)


main =
    worker
        { init = \() -> ( 0, log "MainWithJs application initialized" )
        , subscriptions = \_ -> Sub.none
        , update = \msg model -> ( model, Cmd.none )
        }
