import React, { useRef, useEffect, useState } from 'react'

import { drag } from '../main'
import {
  lineNumberWidth,
  blockAlphabetHeight,
  factoryCanvasDefaultScale,
  sectionHeightDefault,
} from '../constants'
import Playground from '../playground/playground'
import Factory from '../factory/factory'
import '../../postcss/components/editor/editor.css'

import Logo from '../../img/logo/logo-original.svg'
import Settings from '../../img/toolbar-icon/settings.png'
import File from '../../img/toolbar-icon/file.png'
import Share from '../../img/toolbar-icon/share.png'

const Editor = () => {
  /* Editor data */

  const [editor, setEditor] = useState({
    playground: {
      type: 'playground',
      lineStyles: {},
      blocks: {},
    },
    factory: {
      variable: [
        {
          /* --- data --- */
          name: 'cnv' /* For the section/constructed block */,
          removable: false /* Can we delete the section? */,
          type: 'variable' /* What is the type of the customized block? */,
          lineStyles: {} /* lineStyles */,
          blocks: {
            /* blocks */
            '0': {
              /* Line number - start from 0 */
              '0': {
                /* Column number - start from 0 */ name: 'number',
                input: null,
                data: [500],
              },
              '1': {
                name: 'numberSlider',
                input: null,
                data: [500, 0, 2000, 10],
              },
            },
            '1': {
              '0': {
                name: 'createCanvas',
                input: [
                  [0, 0, 0] /* Line number, column number, index of the node */,
                  [0, 1, 0],
                ],
                data: null,
              },
            },
          },
        },
      ],
      function: [],
      object: [],
    },
  })

  /* canvasStyle is stored separately in Editor (for update efficiency) */

  const [editorCanvasStyle, setEditorCanvasStyle] = useState({
    playground: {
      left: lineNumberWidth,
      top: blockAlphabetHeight,
      scale: 1,
    },
    factory: {
      variable: [
        /* --- canvasStyle --- */
        {
          left: lineNumberWidth,
          top: blockAlphabetHeight,
          scale: factoryCanvasDefaultScale,
          sectionHeight: sectionHeightDefault,
        },
      ],
      function: [],
      object: [],
    },
  })

  const leftElement = useRef(),
    rightElement = useRef(),
    separator = useRef()

  // Editor updated
  useEffect(() => {
    // console.log('editor', editor)
  }, [editor])

  // Editor style (of some codeCanvas) updated
  useEffect(() => {
    // console.log('editorCanvasStyle', editorCanvasStyle);
  }, [editorCanvasStyle])

  // Init draggable center divider
  useEffect(() => {
    drag('separator', separator, leftElement, rightElement)
  }, [separator])

  /*

  > editor
  {
    playground: {
      // name: 'playground',
      // removable: false,
      type: 'playground',
      lineStyle: {},
      blocks: {},
    },
    factory: {
      variable: [],
      function: [],
      object: [],
    },
  }

  */

  const collectEditorData = (source, data) => {
    // Combine data from all sources: playground, variable, function, object
    setEditor(prevState => {
      if (prevState[source] !== data) {
        let newState = JSON.parse(JSON.stringify(prevState))
        newState[source] = data
        return newState
      } else {
        return prevState
      }
    })
  }

  const collectEditorCanvasStyle = (source, data, index = 0) => {
    setEditorCanvasStyle(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState))
      if (source === 'playground') newState[source] = data
      else newState.factory[source][index] = data

      return newState
    })
  }

  const addSection = type => {
    const toAdd = JSON.parse(nativeSectionDataToAdd), // Data
      toAddStyle = JSON.parse(nativeSectionStyleToAdd) // Style

    toAdd.type = type

    setEditor(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState)) // Deep copy
      newState.factory[type].push(toAdd)
      return newState
    })

    setEditorCanvasStyle(prevState => {
      let newState = JSON.parse(JSON.stringify(prevState))
      newState.factory[type].push(toAddStyle)
      return newState
    })
  }

  return (
    <div id="editor" className="split">
      <div ref={leftElement} id="editor-left">
        <Playground
          data={editor.playground}
          canvasStyle={editorCanvasStyle.playground}
          collect={collectEditorData}
          collectStyle={collectEditorCanvasStyle}
        />
      </div>

      {/* Separator here */}
      <div ref={separator} className="separator"></div>

      <div ref={rightElement} id="editor-right">
        <div id="header">
          <div className="toolbarIcon settings">
            <img src={Settings} alt="Settings" />
            {/* <Emoji emoji="🔨" label="Settings" /> */}
          </div>
          <div className="toolbarIcon file">
            <img src={File} alt="File" />
            {/* <Emoji emoji="🗒️" label="File" /> */}
          </div>
          <div className="toolbarIcon share">
            <img src={Share} alt="Share" />
            {/* <Emoji emoji="🔗" label="Share" /> */}
          </div>
          <a
            href="https://github.com/peilingjiang/b5"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img id="logo" src={Logo} alt="b5" />
          </a>
        </div>
        <div id="factory">
          {/* Variables Functions Objects */}
          <Factory
            data={editor.factory}
            canvasStyle={editorCanvasStyle.factory}
            addSection={addSection}
            collect={collectEditorData}
            collectStyle={collectEditorCanvasStyle}
          />
          <div className="shadow"></div>
        </div>
      </div>
    </div>
  )
}

// A section template to add to each tab
const nativeSectionData = {
    name: '',
    removable: true,
    type: '' /* Modify before adding... */,
    /*
  type should always be 'variable', 'function', and 'object'
  (w/out 's'!) in the data object and passed along the functions
  */
    lineStyles: {},
    blocks: {},
  },
  nativeSectionStyle = {
    left: lineNumberWidth,
    top: blockAlphabetHeight,
    scale: factoryCanvasDefaultScale,
    sectionHeight: sectionHeightDefault,
  }
const nativeSectionDataToAdd = JSON.stringify(nativeSectionData),
  nativeSectionStyleToAdd = JSON.stringify(nativeSectionStyle)

export default Editor
