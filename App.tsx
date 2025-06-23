"use client"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "./src/redux/store"
import { NavigationContainer } from "@react-navigation/native"
import BottomTab from "./src/navigators/BottomTab"
import DriverBottomTab from "./src/navigators/DriverBottomTab"
import AuthStack from "./src/navigators/AuthStack"
import storage from "./src/storage"
import { setToken, setUser } from "./src/redux/UserSlice"
import { setChildren } from "./src/redux/ChildSlice"
import axios from "axios"
import { API_URL } from "@env"
import { setDriverChildren } from "./src/redux/DriverChildSlice"

const App = () => {
  const userState = useSelector((state: RootState) => state.User)
  const dispatch = useDispatch()

  useEffect(() => {
    const initUser = async () => {
      const token = storage.getString("token")
      const cachedUser = storage.getString("user")
      const userType = storage.getString("userType")

      console.log("Initializing user with token:", token)
      console.log("Cached user:", cachedUser)
      console.log("User type:", userType)

      if (token && cachedUser && userType) {
        dispatch(setToken(token))
        dispatch(setUser({ user: JSON.parse(cachedUser), role: userType as "parent" | "driver" }))

        try {
          // /auth/me ile kullanıcıyı güncelle
          const res = await axios.get(`${API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          dispatch(setUser({ user: res.data, role: userType as "parent" | "driver" }))
          storage.set("user", JSON.stringify(res.data))

          // Eğer parent ise çocukları da çek
          if (userType === "parent") {
            const childRes = await axios.get(`${API_URL}/parent/children`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            dispatch(setChildren(childRes.data.children || []))
          }

          if (userType === "driver") {
            const driverRes = await axios.get(`${API_URL}/driver/students`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            dispatch(setDriverChildren(driverRes.data.students || []))
          }

        } catch (err) {
          console.error("initUser error:", err)
        }
      }
    }

    initUser()
  }, [dispatch])

  return (
    <NavigationContainer>
      {userState.token ? (
        userState.role === "driver" ? <DriverBottomTab /> : <BottomTab />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  )
}

export default App