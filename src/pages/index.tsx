import React, { useEffect, useState } from 'react'
import { Meta, Title, Link } from 'react-head'
import '../style/style.css'

const IndexPage = () => {
  useEffect(() => {
    // Pixi imported here to prevent
    // Fail while deploying
    new (require('../game/index').RootInstance)()
  }, [])

  return (
    <>
      <Meta name="keywords" content="snake, xyoyu" />
      <Meta name="robots" content="index, follow" />
      <Meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <Meta name="language" content="English" />
      <Meta name="author" content="Xyoyu7777" />

      <Meta name="theme-color" content="#7aa3d6" />
      <Link rel="icon" type="image/png" href="/public/favicon-32x32.png" />

      <Title>SnakeyBoi</Title>
      <Meta name="title" content="SnakeyBoi" />
      <Meta
        name="description"
        content="A simple snake game developed by Xyoyu"
      />

      <Meta property="og:type" content="website" />
      <Meta property="og:url" content="https://snake.xyoyu.dev/" />
      <Meta property="og:title" content="SnakeyBoi" />
      <Meta
        property="og:description"
        content="A simple snake game developed by Xyoyu"
      />
      <Meta property="og:image" content="/public/snake_preview.png" />

      <Meta property="twitter:card" content="summary_large_image" />
      <Meta property="twitter:url" content="https://snake.xyoyu.dev/" />
      <Meta property="twitter:title" content="SnakeyBoi" />
      <Meta
        property="twitter:description"
        content="A simple snake game developed by Xyoyu"
      />
      <Meta property="twitter:image" content="/public/snake_preview.png" />
      <div id="container">
        <div id="loading">
          <h4>Loading</h4>
          <img src="/public/loading.gif" alt="Loading Snake..." />
        </div>
      </div>
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div className="scoreKeeper">
            Score: <span id="score">0</span>
          </div>
          <div className="deathKeeper">
            Deaths: <span id="deaths">0</span>
          </div>
        </div>
        <div id="start-button">Start</div>
      </div>
    </>
  )
}

export default IndexPage
