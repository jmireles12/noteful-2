import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircleButton from '../CircleButton/CircleButton';
import ApiContext from '../ApiContext';
import PropTypes from 'prop-types';
import config from '../config';
import './AddNote.css';

export default class AddNote extends Component {

    static contextType = ApiContext;

    state = {
        error: null,
        errors: {
            folderId: 'You must select a folder',
            name: 'You must enter a note title',
            content: 'You must enter a description'
        }
    }

    validateEntry = (name, value) => {
        let err = '';
        if (name === 'name') {
            if(value.length === 0) {
                return 'Name is required.'
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
        this.setState({
            [name]: value.trim()
        },);
        this.validateEntry(name, value.trim());
    }

    handleSubmit = e => {
        e.preventDefault();
        const { name, content, folderId } = e.target;
        const note = {
            name: name.value,
            content: content.value,
            folderId: folderId.value,
            modified: new Date()
        }
        this.setState({ error: null })
        fetch(config.API_NOTES, {
            method: 'POST',
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json',
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
            name.value= '';
            content.value= '';
            folderId.value= '';
            this.context.addNote(data);
            this.setState({ data });
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({error: error});
        })
    }

    handleClickCancel = () => {
        this.props.history.push('/')
    }

    render() {
        const { errors } = this.state;
        const folders = this.context.folders;
        if(this.state.error) {
            return <p className='error'>{this.state.error}</p>
        }
        return(
            <section className='AddNote'>
                <h2>Create a Note</h2>
                <form
                    className='form'
                    onSubmit={this.handleSubmit}
                >
                    <div className='field'>
                        <label htmlFor='name'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            defaultValue=''
                            onChange={this.handleChange}
                        />
                    </div>
                    {errors.name.length > 0 && (
                        <div className='error'>{errors.name}</div>
                    )}
                    <div className='field'>
                        <label htmlFor='note-content-input'>
                            Content
                        </label>
                        <input
                            type='text'
                            id='content'
                            name='content'
                            defaultValue=''
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className='field'>
                        <label htmlFor='note-folder-select'>
                            Folder
                        </label>
                        <select
                            id='folderId'
                            name='folderId'
                            value={this.state.folderId}
                            onChange={this.handleChange}
                        >
                            <option value=''>Select Folder</option>
                            {folders.map(folder =>
                                <option key={folder.id} value={folder.id}>
                                    {folder.name}
                                </option>
                                )}
                        </select>
                    </div>
                    <div className='buttons'>
                        <button type='submit'>
                            Add Note
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

AddNote.propTypes = {
    name: PropTypes.string.isRequired
}