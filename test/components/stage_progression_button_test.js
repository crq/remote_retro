import React from "react"
import { mount, shallow } from "enzyme"
import sinon from "sinon"

import StageProgressionButton from "../../web/static/js/components/stage_progression_button"

describe("StageProgressionButton", () => {
  const mockRetroChannel = { on: () => {}, push: () => {} }
  const mockStageProgressionConfigs = {
    stageUno: {
      confirmationMessage: "Are you sure?",
      nextStage: "stageDos",
      buttonConfig: {
        copy: "Proceed to stage dos",
        iconClass: "arrow right",
      },
    },
    stageDos: {
      confirmationMessage: null,
      nextStage: "stageTres",
      buttonConfig: {
        copy: "blurg!",
        iconClass: "send",
      },
    },
  }

  const defaultProps = {
    retroChannel: mockRetroChannel,
    stage: "stageUno",
    stageProgressionConfigs: mockStageProgressionConfigs,
  }

  let stageProgressionButton

  beforeEach(() => {
    stageProgressionButton = mount(
      <StageProgressionButton {...defaultProps} />
    )
  })

  it("displays the button text from the matching stage config", () => {
    expect(stageProgressionButton.text()).to.match(/proceed to stage dos/i)
  })

  it("uses the icon class from the matching stage config", () => {
    expect(stageProgressionButton.find("i").hasClass("arrow")).to.equal(true)
  })

  context("onClick", () => {
    context("when the stage progression config requires confirmation", () => {
      let stageProgressionButton
      let retroChannel
      let confirmStub

      beforeEach(() => {
        retroChannel = { on: () => {}, push: sinon.spy() }

        stageProgressionButton = mount(
          <StageProgressionButton {...defaultProps} stage="stageUno" retroChannel={retroChannel} />
        )
      })

      context("when the stage progression button is clicked", () => {
        it("opens the modal", () => {
          stageProgressionButton.find("button").simulate("click")
          expect(stageProgressionButton.find("Modal").props().isOpen).to.equal(true)
        })
      })

      context("when clicking yes in the modal", () => {
        beforeEach(() => {
          console.log("BEEEEFFFOOOREEEE")
          stageProgressionButton.find("button").simulate("click")
          console.log(stageProgressionButton.find("Modal").children("button").first())
          stageProgressionButton.find("Modal").children("button").first()
            .simulate("click")
        })

        it("pushes `proceed_to_next_stage` to the retroChannel, passing the next stage", () => {
          expect(
            retroChannel.push.calledWith("proceed_to_next_stage", { stage: "stageDos" })
          ).to.equal(true)
        })

        // it("hides the modal", () => { })
      })

      context("when the user does not confirm", () => {
        it("does not push an event to the retro channel", () => {
          confirmStub.returns(false)
          stageProgressionButton.simulate("click")

          expect(
            retroChannel.push.called
          ).to.equal(false)
        })
      })
    })

    context("when the matching stage config lacks a `confirmationMessage`", () => {
      beforeEach(() => {
        stageProgressionButton = mount(
          <StageProgressionButton {...defaultProps} stage="stageDos" />
        )
      })

      context("onClick", () => {
        let confirmSpy
        let stageProgressionButton
        let retroChannel

        beforeEach(() => {
          confirmSpy = sinon.spy(global, "confirm")
          retroChannel = { on: () => {}, push: sinon.spy() }

          const props = { ...defaultProps, retroChannel, stage: "stageDos" }
          stageProgressionButton = mount(<StageProgressionButton {...props} />)

          stageProgressionButton.simulate("click")
        })

        it("does not invoke a javascript confirmation", () => {
          expect(confirmSpy.called).to.equal(false)
          confirmSpy.restore()
        })

        it("pushes `proceed_to_next_stage` to the retroChannel, passing the next stage", () => {
          expect(
            retroChannel.push.calledWith("proceed_to_next_stage", { stage: "stageTres" })
          ).to.equal(true)
        })
      })
    })
  })
})
