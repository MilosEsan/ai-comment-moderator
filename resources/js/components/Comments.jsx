import React, { PureComponent } from 'react'
import { CommentSection } from 'react-comments-section'
import 'react-comments-section/dist/index.css'
import SweetAlert2 from 'react-sweetalert2';

class Comments extends PureComponent {
  state = {
    data: [
      {
        userId: '01a',
        comId: '012',
        fullName: 'Riya Negi',
        avatarUrl: 'https://ui-avatars.com/api/name=Riya&background=random',
        userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
        text: 'Hey, Loved your blog! ',
        timestamp: '2024-09-28T12:34:56Z',
        replies: []
      },
      {
        userId: '02b',
        comId: '017',
        fullName: 'Lily',
        userProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
        text: 'I have a doubt about the 4th point🤔',
        avatarUrl: 'https://ui-avatars.com/api/name=Lily&background=random',
        timestamp: '2024-09-28T12:34:56Z',
        replies: []
      }
    ],
    swal: {},
    response: '',
    lastCommentText: '',
  }

  onSubmitAction = (data) => {
    this.setState({ lastCommentText: data.text }, () => {
      this.callAI(`Check if the following comment is positive or negative: ${data.text}`);
    });
  }

  giveFeedback = () => {
      if (this.state.response.toLowerCase() === 'negative') {
        this.setState({
          swal: {
            show: true,
            title: 'Warning',
            text: 'This kind of comment is not allowed',
            icon: 'warning',
            confirmButtonText: 'OK',
            allowOutsideClick: false,
            allowEscapeKey: false,
            onConfirm: () => {
              this.setState(prevState => ({
                data: prevState.data.filter(comment => comment.text !== prevState.lastCommentText),
                swal: {}
              }))
            },
          }
        })
      }
      else {
        return;
      }
  }

  callAI = (input) => {
    fetch('https://api-inference.huggingface.co/models/google/flan-t5-base', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: input,
        })
      })
      .then(response => response.json())
      .then(data => {
        this.setState({
          response: data[0].generated_text,
        }, () => {
          this.giveFeedback(); // ✅ Ovo će se pozvati tek kada se state zapravo ažurira
        });
      })
      .catch(error => {
        console.error('Error:', error);
      });
      
  }

  customNoComment = () => <div className='no-com'>No comments wohoooo!</div>

  render() {
    return (
        <div>
            <CommentSection
            currentUser={{
                currentUserId: '01a',
                currentUserImg:
                'https://ui-avatars.com/api/name=Riya&background=random',
                currentUserProfile: 'https://www.linkedin.com/in/riya-negi-8879631a9/',
                currentUserFullName: 'Riya Negi'
            }}
            commentData={this.state.data}
            onSubmitAction={(data) => this.onSubmitAction(data)}
            customNoComment={() => this.customNoComment()}
            logIn={{
                onLogin: () => alert('Call login function '),
                signUpLink: 'http://localhost:3001/'
            }}
            placeholder="Write your comment..."
            />
              <SweetAlert2 {...this.state.swal} />
        </div>
    )
  }
}

export default Comments