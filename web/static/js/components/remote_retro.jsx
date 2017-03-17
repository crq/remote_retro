import React, { Component, PropTypes } from "react"
import { Presence } from "phoenix"

import RetroChannel from "../services/retro_channel"
import Room from "./room"

import UrlHelpers from "../services/url_helpers"

class RemoteRetro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      presences: {},
      retroChannel: {},
    }
  }

  componentWillMount() {
    const token = this.props.token
    const retroUUID = UrlHelpers.parseRetroUUID(location.pathname)
    const retroChannel = RetroChannel.configure({ token, retroUUID })

    retroChannel.on("presence_state", (presences) => {
      this.setState({ presences })
    })
    retroChannel.join()

    this.setState({ retroChannel })
  }

  render() {
    const { token } = this.props
    const { presences } = this.state
    const users = Presence.list(presences, (_username, presence) => (
      presence.user
    ))
    const currentPresence = presences[token]

    let isFacilitator
    if (currentPresence) {
      isFacilitator = currentPresence.user.facilitator
    }

    return (
      <Room
        users={users}
        isFacilitator={isFacilitator}
        retroChannel={this.state.retroChannel}
      />
    )
  }
}

RemoteRetro.propTypes = {
  token: PropTypes.string.isRequired,
}

export default RemoteRetro
