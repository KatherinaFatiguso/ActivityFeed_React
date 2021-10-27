import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import PropTypes from 'prop-types'

let data = require('./activity_feed');

const blueText = {
  fontFamily: 'arial',
  fontSize: '16pt',
  color: '#0085c0'
};

const greyText = {
  fontFamily: 'arial',
  fontSize: '12pt',
  fontWeight: 'bold',
  color: '#778589',
  textTransform: 'uppercase',
};

const border = {
  borderBottom: '0.25px solid #778589'
};

const spacing = {
  marginTop: '30px',
  marginBottom: '30px'
}

class Task extends React.Component {
  render () {
    const { profileId, firstAction, taskId, secondAction, recipientId } = this.props

    return (
      <section style={border}>
        <p style={spacing}>
          <span id="users" style={blueText} onmouseover={}>console.log('hiiii')</span>
          <span style={greyText}> {firstAction} </span>
          <span style={blueText} id="tasks">{taskId}</span>
          <span style={greyText}> {secondAction} </span>
          <span style={blueText}>{recipientId}</span>
        </p>

      </section>
    )
  }
}

const getName = profile_id => {
  let name = "";
  data["profiles"].map(profile => {
    if(profile.id === parseInt(profile_id, 10)) {
      name = profile.abbreviated_name;
    }
    return null;
  });
  return name;
};

const getTask = task_id => {
  let taskName = "";
  data["tasks"].map(task => {
    if(task.id === parseInt(task_id, 10)) {
      taskName = task.name;
    }
    return null;
  });
  return taskName;
};

  const getProfileId = text => {
    let profile = text.split("{ profiles:");
    let profile_id = profile[1].split(" } ");
    return profile_id[0];
  };

  const getFirstAction = text => {
    let action_text = text.split(" } ");
    let first_action = action_text[1].split(" { ");
    return first_action[0];
  }

  const getTaskId = text => {
    let task = text.split("task:");
    let taskId, secondAction, recipientId = void(0);
    if(task[1]) {
      let task_id_split = task[1].split(" }");
      taskId = task_id_split[0];
      if(task_id_split[1]) {
        let extended_template = task_id_split[1].split(" { profiles:");
        secondAction = extended_template[0];
        recipientId = extended_template[1];
      }
    }
    return {taskId: taskId, secondAction: secondAction, recipientId: recipientId};
  }

  function displayLink(state="", action) {
    if(typeof state === 'undefined') {
      return null;
    }
    switch (action.type) {
      case 'HOVER-IN':
        return state + "I'm in"
      case 'HOVER-OUT':
        return state + "I'm out"
      default:
        return state
    }
  }

const store = createStore(displayLink)
class List extends React.Component {
  render () {
    console.log("activity_feed", data["activity_feed"]);
    console.log("profiles", data["profiles"]);
    console.log("tasks", data["tasks"]);
    console.log("locations", data["locations"]);
    const { value, hoverIn, hoverOut } = this.props;
    return (
      <div>
        {data["activity_feed"].map((activity, i) =>
            <Task
              key={i}
              profileId={getName(getProfileId(activity.template))}
              firstAction={getFirstAction(activity.template)}
              taskId={getTask(getTaskId(activity.template).taskId)}
              secondAction={getTaskId(activity.template).secondAction}
              recipientId={getName(getTaskId(activity.template).recipientId)}
            />
        )}
        {
          <span id="path-link">Link/appears/here</span>
        }
      </div>
    )
  }
}

List.propType = {
  value:PropTypes.string,
  hoverIn: PropTypes.func,
  hoverOut: PropTypes.func,
}

ReactDOM.render(<List items={data}
  value={store.getState()}
  hoverIn ={() => store.dispatch({ type: 'HOVER-IN'  })}
  hoverOut={() => store.dispatch({ type: 'HOVER-OUT' })}
  />,
  document.getElementById('root'));
