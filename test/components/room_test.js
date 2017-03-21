import React from "react"
import { shallow } from "enzyme"
import { expect } from "chai"
import sinon from "sinon"

import Room from "../../web/static/js/components/room"
import CategoryColumn from "../../web/static/js/components/category_column"
import ActionItemToggle from "../../web/static/js/components/action_item_toggle"

describe("Room component", () => {
  const mockRetroChannel = { push: sinon.spy(), on: () => {} }

  describe(".handleIdeaSubmission", () => {
    it("pushes the idea to the room channel", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)

      roomComponent
        .instance()
        .handleIdeaSubmission({ category: "sad", body: "we don't use our linter" })

      expect(
        mockRetroChannel.push.calledWith("new_idea", { category: "sad", body: "we don't use our linter" }),
      ).to.equal(true)
    })
  })

  describe("ActionItemToggle rendering", () => {
    it("when the current user is facilitator renders <ActionItemToggle>", () => {
      const wrapper = shallow(
        <Room retroChannel={mockRetroChannel} isFacilitator users={[]} />)

      expect(wrapper.find(ActionItemToggle)).to.have.length(1)
    })

    it("when the current user is not facilitator renders <ActionItemToggle>", () => {
      const wrapper = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)

      expect(wrapper.find(ActionItemToggle)).to.have.length(1)
    })
  })

  describe("Action item column", () => {
    it("is not visible on render", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} />,
      )).to.equal(false)
    })

    it("becomes visible when showActionItem is true", () => {
      const roomComponent = shallow(<Room retroChannel={mockRetroChannel} users={[]} />)
      roomComponent.setState({ showActionItem: true })

      expect(roomComponent.containsMatchingElement(
        <CategoryColumn category="action-item" ideas={[]} />,
      )).to.equal(true)
    })
  })
})
