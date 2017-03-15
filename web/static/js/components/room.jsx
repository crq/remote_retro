import React, { Component } from "react"

import UserList from "./user_list"
import CategoryColumn from "./category_column"
import IdeaSubmissionForm from "./idea_submission_form"
import ActionItemToggle from "./action_item_toggle"
import DoorChime from "./door_chime"

import styles from "./css_modules/room.css"

class Room extends Component {
  constructor(props) {
    super(props)
    this.state = { ideas: [], showActionItem: false }
    this.handleIdeaSubmission = this.handleIdeaSubmission.bind(this)
    this.handleToggleActionItem = this.handleToggleActionItem.bind(this)
  }

  componentDidMount() {
    this.props.retroChannel.on("existing_ideas", (payload) => {
      this.setState({ ideas: payload.ideas })
    })

    this.props.retroChannel.on("new_idea_received", (newIdea) => {
      this.setState({ ideas: [...this.state.ideas, newIdea] })
    })
  }

  handleIdeaSubmission(idea) {
    this.props.retroChannel.push("new_idea", idea)
  }

  handleToggleActionItem() {
    this.setState({ showActionItem: !this.state.showActionItem })
  }

  render() {
    return (
      <section className={styles.wrapper}>
        <div className={`ui equal width padded grid ${styles["category-columns-wrapper"]}`}>
          <CategoryColumn category="happy" ideas={this.state.ideas} />
          <CategoryColumn category="sad" ideas={this.state.ideas} />
          <CategoryColumn category="confused" ideas={this.state.ideas} />
          { this.state.showActionItem
            ? <CategoryColumn category="action-item" ideas={this.state.ideas} /> : null
          }
        </div>

        <UserList users={this.props.users} />
        <div className="ui stackable grid basic attached secondary segment">
          <div className="thirteen wide column">
            <IdeaSubmissionForm
              onIdeaSubmission={this.handleIdeaSubmission}
              showActionItem={this.state.showActionItem}
            />
          </div>
          <div className="three wide column">
            { this.props.isFacilitator
              ? <ActionItemToggle onToggleActionItem={this.handleToggleActionItem} /> : null
            }
          </div>
        </div>
        <DoorChime users={this.props.users} />
      </section>
    )
  }
}

Room.defaultProps = {
  isFacilitator: false,
}

Room.propTypes = {
  isFacilitator: React.PropTypes.bool,
  retroChannel: React.PropTypes.shape({
    on: React.PropTypes.func,
    push: React.PropTypes.func,
  }).isRequired,
  users: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string,
      online_at: React.PropTypes.number,
    }),
  ).isRequired,
}

export default Room
