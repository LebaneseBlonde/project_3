import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import { getLoggedInUserId } from '../lib/auth.js'


function BookingForm({ propertyId, maxNumberOfGuests }) {

  const LoggedInUserId = getLoggedInUserId()


  const [error, updateError] = useState('')
  const [success, updateSuccess] = useState('')
  const [formData, updateFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: ''
  })

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const newFormData = {
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      numberOfGuests: formData.numberOfGuests
    }
    newFormData[name] = value
    updateFormData(newFormData)
    //console.log(newFormData)
  }



  async function handleSubmit(event) {
    const token = localStorage.getItem('token')
    event.preventDefault()


    if (!formData.checkInDate || !formData.checkOutDate || !formData.numberOfGuests || formData.numberOfGuests === 'Please select') {
      updateError('Please select a check in date, check out date, and the number of guests.')
      updateSuccess('')
    } else {
      try {
        const { data } = await axios.post(`/api/bookings/${propertyId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        updateError('')
        updateSuccess('Congratulations! Your booking is now confirmed')
      } catch (err) {
        updateError(err.response.data.message)
        updateSuccess('')
      }
    }
  }



  const maxNumberOfGuestsArray = ['Please select']
  for (let i = 1; i < maxNumberOfGuests + 1; i++) {
    maxNumberOfGuestsArray.push(i)
  }


  if (!LoggedInUserId) {
    return null
  }

  return <div className='box mt-6'>

    {error && <div className='box has-background-danger has-text-white'>{error}</div>}
    {success && <div className='box has-background-primary has-text-white'>{success}</div>}

    {!success &&
      <div>
        <h5 className='title is-5 mt-4 mb-2'>Book Now</h5>
        <p className='mb-4'>This property can accommodate a maximum of <strong>{maxNumberOfGuests}</strong> guests.</p>
        <form onSubmit={handleSubmit}>
          <div className='columns'>
            <div className='column'>
              <label className="label">Check in: </label>
              <input
                className="input"
                type="text"
                value={formData.checkInDate}
                onChange={handleChange}
                name={'checkInDate'}
              />
            </div>
            <div className='column'>
              <label className="label">Check out: </label>
              <input
                className="input"
                type="text"
                value={formData.checkOutDate}
                onChange={handleChange}
                name={'checkOutDate'}
              />
            </div>
            <div className='column'>
              <label className="label">Guests: </label>


              <div className="select">
                <select
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  name={'numberOfGuests'}>

                  {
                    maxNumberOfGuestsArray.map((number, index) => {
                      return <option key={index}>{number}</option>

                    })
                  }

                </select>
              </div>

            </div>
          </div>
          <p>Total days:</p>
          <p>Total price:</p>
          <button className='button is-primary mt-4'>Book now</button>
        </form>
      </div>
    }

  </div>
}

export default withRouter(BookingForm)