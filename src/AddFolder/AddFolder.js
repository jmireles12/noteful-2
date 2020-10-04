import React, { Component } from 'react';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import config from '../config';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AddFolder.css';

export default class AddFolder extends Component {
    static contextType = ApiContext;

    state = {
        errors: {
            name: 'You must enter a note title'
        }
    }

    validateEntry = (name, value) => {
        let err='';
        if(name === 'name') {
            if (value.trim().length === 0) {
                return 'Folder name is required.'
            }
            else if (name.length < 3) {
                return 'Name must be at least 3 characters long';
            }
        }
        const { errors } = { ...this.state };
        errors[name] = err;
        this.setState({ errors });
    }

    handleChange = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value.trim() });
        this.validateEntry(name, value);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { name } = e.target;
        const folder = {
            name: name.value
        };

        fetch(config.API_FOLDERS, {
            method: 'POST',
            body: JSON.stringify(folder),
            headers: {
                'content-type': 'application/json'
            }
        })
        .then(res => {
            if(!res.ok) {
                return res.json().then(error => {
                    throw error;
                });
            }
            return res.json();
        })
        .then(data => {
            name.value = '';
            this.context.addFolder(data);
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({error});
        })
    }

    render() {
        const { errors } = this.state;
        return (
            <section className='AddFolder'>
            <form  onSubmit={e => this.handleSubmit(e)}>
                <h2>Create a Folder</h2>
                    <div className='field'>
                        <label htmlFor='folder-name-input'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            onChange={this.handleChange}
                        />
                    </div>
                    {errors.name.length > 0 && (
                        <div className='error'>{errors.name}</div>
                    )}
                    <div className='buttons'>
                        <button type='submit'>
                            Add Folder
                        </button>
                    </div>
            </form>
                <CircleButton
                    tag='button'
                    role='link'
                    onClick={() => this.props.history.goBack()}
                    className='NotePageNav__back-button'
                >
                    <FontAwesomeIcon icon='chevron-left' />
                    <br />
                    Back
                </CircleButton>
            </section>
        )
    }
}

AddFolder.defaultProps = {
    folders: [],
    content: '',
    name: '',
    error: null
}

AddFolder.propTypes = {
    folders: PropTypes.arrayOf(PropTypes.shape ({
        name: PropTypes.string.isRequired,
        id: PropTypes.string,
        content: PropTypes.string,
        modified: PropTypes.string
    }))
}