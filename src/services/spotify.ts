'use client'
import axios from 'axios';
import { login } from './redux/user/slice';
import { setAleatory, setCurrentPlaylistId, setCurrentPlaylistType, setOrderLibraryUser, setPlayMusic, setRepeat, setTrackCover, setTrackNumber, setTracksPlaylist, setUserPlaylists } from './redux/playlists/slice';
import store from './redux/store';
import { ShowPopup } from './redux/popup/slice';

const path = 'https://api.spotify.com/v1';

const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${typeof window !== "undefined" ? window?.localStorage.token : ''}`
}

export async function GetUser() {
  if (window.localStorage.token) {
    await axios.get(`${path}/me`, {
      headers
    }).then(({ data }) => {
      store.dispatch(login(data))
    }).catch(err => {
      handleErrors(err)
    })
  }
}

export async function GetUserPlaylists() {
  const order = store.getState().playlistsReducer.orderLibraryUser

  let playlists: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/playlists?limit=50`, {
      headers
    }).then(async ({ data }) => {
      if (order === 'recent') {
        playlists = data.items
      }

      if (order === 'alphabetical') {
        await handleAlphabeticalOrder(data.items).then(data => {
          playlists = data
        })
      }

      store.dispatch(setUserPlaylists(playlists))
    }).catch(err => {
      handleErrors(err)
    })
  }

  return playlists
}

export async function GetCategoryPlaylists(category: string, limit: number) {
  let playlists: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/browse/categories/${category}/playlists?limit=${limit}`, {
      headers
    }).then(({ data }) => {
      playlists = data.playlists.items
    }).catch(err => {
      handleErrors(err)
    })
  }

  return playlists
}

export async function getUserPlaylistLikedMusics() {
  let playlists: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/tracks?limit=50`, {
      headers
    }).then(({ data }) => {
      playlists = data.items
    }).catch(err => {
      handleErrors(err)
    })
  }


  return playlists
}

export async function GetPlaylistItems(playlist_id: string) {
  let items: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/playlists/${playlist_id}/tracks`, {
      headers
    }).then(({ data }) => {
      items = data.items
    }).catch(err => {
      handleErrors(err)
    })
  }


  return items
}

export async function GetPlaylist(playlist_id: string) {
  let items: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/playlists/${playlist_id}`, {
      headers
    }).then(({ data }) => {
      items = data
    }).catch(err => {
      handleErrors(err)
    })
  }


  return items
}

export async function DeleteUserPlaylist(
  id: string,
  setLoading: (loading: boolean) => void,
  setFollowed: (loading: boolean) => void) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.delete(`${path}/playlists/${id}/followers`, {
      headers
    }).then(async () => {
      await GetUserPlaylists().then(data => {
        store.dispatch(setUserPlaylists(data))
        store.dispatch(ShowPopup({
          text: 'Remove from your library',
          show: true
        }))

        setLoading(false)
        setFollowed(false)
      })
    }).catch(err => {
      handleErrors(err)
    })
  }
}

export async function FollowPlaylist(
  playlist_id: string,
  setLoading: (loading: boolean) => void,
  setFollowed: (loading: boolean) => void,
  buttonUnfollowRef: any) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.put(`${path}/playlists/${playlist_id}/followers`, {
      public: false
    },
      {
        headers
      }).then(async () => {
        await GetUserPlaylists().then(data => {
          store.dispatch(setUserPlaylists(data))
          store.dispatch(ShowPopup({
            text: 'Added to your library',
            show: true
          }))

          if (buttonUnfollowRef) {
            setTimeout(() => {
              buttonUnfollowRef.current.classList.add('animate-buttonFollow')
            }, 100)
          }
          
          setLoading(false)
          setFollowed(true)
        })
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function CheckIfUserFollowPlaylist(playlist_id: string) {
  const user: any = store.getState().userReducer.user

  let response: any

  if (window.localStorage.token && user) {
    await axios.get(`${path}/playlists/${playlist_id}/followers/contains?ids=${user.id}`,
      {
        headers
      }).then(({ data }) => {
        response = data[0]
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function FollowArtist(
  id: string,
  type: string,
  setLoading: (loading: boolean) => void,
  setLiked: (loading: boolean) => void,
  buttonUnfollowRef: any
  ) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.put(`${path}/me/following?type=${type}`, {
      ids: [
        id
      ]
    },
      {
        headers
      }).then(() => {
        store.dispatch(ShowPopup({
          text: 'Added to followed artists',
          show: true
        }))

        if (buttonUnfollowRef) {
          setTimeout(() => {
            buttonUnfollowRef.current.classList.add('animate-buttonFollow')
          }, 100)
        }

        setLoading(false)
        setLiked(true)
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function UnfollowArtist(
  id: string,
  type: string,
  setLoading: (loading: boolean) => void,
  setLiked: (loading: boolean) => void) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.delete(`${path}/me/following?type=${type}&ids=${id}`,
      {
        headers
      }).then(() => {
        store.dispatch(ShowPopup({
          text: 'Remove from followed artists',
          show: true
        }))

        setLoading(false)
        setLiked(false)
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function CheckIfUserFollowedArtist(id: string, type: string) {
  let response: any

  if (window.localStorage.token) {
    await axios.get(`${path}/me/following/contains?type=${type}&ids=${id}`,
      {
        headers
      }).then(({ data }) => {
        response = data[0]
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetCategories() {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/browse/categories?limit=50`,
      {
        headers
      }).then(({ data }) => {
        response = data.categories.items
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetSingleCategory(category_id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/browse/categories/${category_id}`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export const SearchUserLibrary = async (text: string) => {
  let list: any = await GetUserPlaylists()

  let listResult = list.filter(function (value: any) {
    return value.name.toLowerCase().indexOf(text.toLowerCase()) > -1
  })

  store.dispatch(setUserPlaylists(listResult))
}

export async function handleOrderLibrary(order: string) {
  store.dispatch(setOrderLibraryUser(order))

  await GetUserPlaylists()
}

export const handleAlphabeticalOrder = async (list: []) => {
  return list.sort((a: any, b: any) => {
    let x = a.name.toUpperCase()
    let y = b.name.toUpperCase()
    return x == y ? 0 : x > y ? 1 : -1
  })
}

async function CustomPlaylistCoverImage(playlist_id: string, photo?: string) {
  let defaultCover = "/9j/2wCEABoZGSccJz4lJT5CLy8vQkc9Ozs9R0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0cBHCcnMyYzPSYmPUc9Mj1HR0dEREdHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR//dAAQAAf/uAA5BZG9iZQBkwAAAAAH/wAARCAABAAEDACIAAREBAhEB/8QASwABAQAAAAAAAAAAAAAAAAAAAAYBAQAAAAAAAAAAAAAAAAAAAAAQAQAAAAAAAAAAAAAAAAAAAAARAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwAAARECEQA/AJgAH//Z"

  if (window.localStorage.token) {
    photo ? await axios.put(`${path}/playlists/${playlist_id}/images
    `, photo ??= defaultCover,
      {
        headers: {
          'Content-Type': 'image/jpeg',
          'Authorization': `Bearer ${typeof window !== "undefined" ? window?.localStorage.token : ''}`
        },
      }).then(async () => {
        await GetUserPlaylists()
      }).catch(err => {
        handleErrors(err)
      })
      :
      await GetUserPlaylists()
  }
}


export async function CreatePlaylist(user_id: string, name: string, _public: boolean, description: string, photo?: string) {
  let res: any = []
  if (window.localStorage.token) {
    await axios.post(`${path}/users/${user_id}/playlists
    `, {
      name,
      description,
      public: _public
    },
      {
        headers
      }).then(async (data: any) => {
        res = data.data
        await CustomPlaylistCoverImage(data.data.id, photo)
      }).catch(err => {
        handleErrors(err)
      })
  }

  return res
}

export async function AddToPlaylist(playlist_id: string, uri: string, playlistName: string) {
  if (window.localStorage.token) {
    await axios.post(`${path}/playlists/${playlist_id}/tracks
    `, {
      uris: [
        uri
      ]
    },
      {
        headers
      }).then(() => {
        store.dispatch(ShowPopup({
          text: `Added to ${playlistName}`,
          show: true
        }))
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function GetTopArtists() {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/top/artists?limit=50`,
      {
        headers
      }).then(({ data }) => {
        response = data.items
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetFeaturedPlaylists() {
  let playlists: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/browse/featured-playlists?limit=4`, {
      headers
    }).then(({ data }) => {
      playlists = data.playlists.items
    }).catch(err => {
      console.log(err)
      handleErrors(err)
    })
  }

  return playlists
}

export async function GetArtist(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/artists/${id}`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetArtistTopTracks(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/artists/${id}/top-tracks?market=ES`,
      {
        headers
      }).then(({ data }) => {
        response = data.tracks
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetArtistAlbums(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/artists/${id}/albums`,
      {
        headers
      }).then(({ data }) => {
        response = data.items
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetArtistRelatedArtists(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/artists/${id}/related-artists`,
      {
        headers
      }).then(({ data }) => {
        response = data.artists
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetAlbum(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/albums/${id}`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function handleFollow(
  link: string,
  id: string,
  type: string,
  setLoading: (loading: boolean) => void,
  setLiked: (loading: boolean) => void,
  buttonUnfollowRef: any) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.put(`${path}/${link}`, {
      ids: [
        id
      ]
    },
      {
        headers
      }).then(() => {
        store.dispatch(ShowPopup({
          text: `Added to followed ${type}`,
          show: true
        }))

        if (buttonUnfollowRef) {
          setTimeout(() => {
            buttonUnfollowRef.current.classList.add('animate-buttonFollow')
          }, 1)
        }

        setLoading(false)
        setLiked(true)
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function handleUnfollow(
  link: string,
  id: string,
  type: string,
  setLoading: (loading: boolean) => void,
  setLiked: (loading: boolean) => void) {
  if (window.localStorage.token) {
    setLoading(true)
    await axios.delete(`${path}/${link}?ids=${id}`,
      {
        headers
      }).then(() => {
        store.dispatch(ShowPopup({
          text: `Remove from followed ${type}`,
          show: true
        }))

        setLoading(false)
        setLiked(false)
      }).catch(err => {
        handleErrors(err)
      })
  }
}

export async function checkIfUserFollowed(
  link: string,
  id: string,
) {
  let response: any

  if (window.localStorage.token) {
    await axios.get(`${path}/${link}?ids=${id}`,
      {
        headers
      }).then(({ data }) => {
        response = data[0]
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function handleSearch(text: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/search?q=${text}&type=album%2Cplaylist%2Ctrack%2Cartist`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function getRecentlyPlayedTrack() {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/me/player/recently-played?limit=1`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function GetTrack(id: string) {
  let response: any = []

  if (window.localStorage.token) {
    await axios.get(`${path}/tracks/${id}`,
      {
        headers
      }).then(({ data }) => {
        response = data
      }).catch(err => {
        handleErrors(err)
      })
  }

  return response
}

export async function handlePlayItem(type: string, id?: string) {
  store.dispatch(setAleatory(false))
  store.dispatch(setRepeat('off'))
  switch (type) {
    case 'playlist':
      if (id) {
        await GetPlaylist(id).then(data => {
          store.dispatch(setCurrentPlaylistId(id))
          store.dispatch(setTracksPlaylist(data.tracks.items))
          store.dispatch(setPlayMusic(true))
          store.dispatch(setTrackNumber(0))
          store.dispatch(setCurrentPlaylistType('playlist'))
        })
      }
      break;
    case 'album':
      if (id) {
        await GetAlbum(id).then(data => {
          store.dispatch(setCurrentPlaylistId(id))
          store.dispatch(setTrackCover(data.images[0]))
          store.dispatch(setTracksPlaylist(data.tracks.items))
          store.dispatch(setPlayMusic(true))
          store.dispatch(setTrackNumber(0))
          store.dispatch(setCurrentPlaylistType('album'))
        })
      }
      break;
    case 'track':
      if (id) {
        await GetTrack(id).then(data => {
          let track: any = []
          track.push(data)
          store.dispatch(setTracksPlaylist(track))
          store.dispatch(setPlayMusic(true))
          store.dispatch(setTrackNumber(0))
        })
      }
      break;
    case 'favorites':
      await getUserPlaylistLikedMusics().then(data => {
        store.dispatch(setCurrentPlaylistId(null))
        store.dispatch(setTracksPlaylist(data))
        store.dispatch(setPlayMusic(true))
        store.dispatch(setTrackNumber(0))
        store.dispatch(setCurrentPlaylistType('favorites'))
      })
      break;
  }

}

export async function handleRemovePlaylistItem(
  playlist_id: string,
  playlist: string,
  trackUri: string) {
  if (window.localStorage.token) {
    await axios.delete(`${path}/playlists/${playlist_id}/tracks`,
      {
        headers,
        data: {
          tracks: [
            {
              uri: trackUri
            }
          ]
        }
      }).then(() => {
        store.dispatch(ShowPopup({
          text: `Remove track from ${playlist}`,
          show: true
        }))
      }).catch(err => {
        handleErrors(err)
      })
  }
}


const handleErrors = (err: any) => {
  if (!window?.localStorage.token) {
    window.localStorage.removeItem('token')
  }

  if (err.response.status === 403) {
    window.localStorage.removeItem('token')
    location.reload()
  }

  if (err.response.data.error?.message === 'Invalid access token') {
    location.reload()
  }

  if (err.response.data.error?.message === 'The access token expired') {
    window.localStorage.removeItem('token')
    location.reload()
  }

  console.log(err)
}