import React from "react"
import Modal from "react-modal"

const ModalWrapper = ({ children }) => (
  <Modal>
    { React.cloneElement(children) }
  </Modal>
)
