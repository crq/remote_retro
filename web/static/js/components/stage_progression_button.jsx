import React, { Component } from "react"
import Modal from "react-modal"
import * as AppPropTypes from "../prop_types"

class StageProgressionButton extends Component {
  constructor(props) {
    super(props)
    this.handleStageProgression = this.handleStageProgression.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleStageProgressionButtonClick = this.handleStageProgressionButtonClick.bind(this)
    this.state = { modalOpen: false }
  }

  handleStageProgressionButtonClick() {
    const { stage, stageProgressionConfigs } = this.props
    const stageConfig = stageProgressionConfigs[stage]
    const noConfirmationNecessary = !stageConfig.confirmationMessage
    if (noConfirmationNecessary) {
      this.handleStageProgression()
    } else {
      this.setState({ modalOpen: true })
    }
  }

  handleStageProgression() {
    const { stage, retroChannel, stageProgressionConfigs } = this.props
    const stageConfig = stageProgressionConfigs[stage]

    retroChannel.push("proceed_to_next_stage", { stage: stageConfig.nextStage })
    this.setState({ modalOpen: false })
  }

  handleModalClose() {
    this.setState({ modalOpen: false })
  }

  render() {
    const { stage, stageProgressionConfigs } = this.props
    const { buttonConfig, confirmationMessage } = stageProgressionConfigs[stage]
    const { modalOpen } = this.state
    return (
      <div>
        <Modal
          contentLabel="Modal"
          isOpen={modalOpen}
        >
          <h1>{ confirmationMessage }</h1>
          <button id="yes" onClick={this.handleStageProgression}>Yes</button>
          <button id="no" onClick={this.handleModalClose}>No</button>
        </Modal>
        <button
          className="fluid ui right labeled teal icon button"
          onClick={this.handleStageProgressionButtonClick}
        >
          { buttonConfig.copy }
          <i className={`${buttonConfig.iconClass} icon`} />
        </button>
      </div>
    )
  }
}

StageProgressionButton.propTypes = {
  retroChannel: AppPropTypes.retroChannel.isRequired,
  stage: React.PropTypes.string.isRequired,
  stageProgressionConfigs: React.PropTypes.object.isRequired,
}

export default StageProgressionButton
