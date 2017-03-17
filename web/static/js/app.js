/* eslint-disable react/jsx-filename-extension */

import React from "react"
import { render } from "react-dom"

import RemoteRetro from "./components/remote_retro"

const token = window.token
const reactRoot = document.querySelector(".react-root")

render(<RemoteRetro token={token} />, reactRoot)

