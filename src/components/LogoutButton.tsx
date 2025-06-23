import type React from "react"
import { Alert } from "react-native"
import { useDispatch } from "react-redux"
import { clearUser } from "../redux/UserSlice"
import ProfileMenuItem from "./ProfileMenuItem"
import Colors from "../styles/Colors"

interface LogoutButtonProps {
  userType?: "parent" | "driver"
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ userType = "parent" }) => {
  const dispatch = useDispatch()

  const handleLogout = () => {
    const userTypeText = userType === "driver" ? "şoför" : "veli"
    const goodbyeMessage = userType === "driver" ? "İyi günler!" : "Güle güle!"

    Alert.alert(
      "Çıkış Yap",
      `${userTypeText} hesabınızdan çıkış yapmak istediğinize emin misiniz?`,
      [
        {
          text: "İptal",
          style: "cancel",
        },
        {
          text: "Çıkış Yap",
          onPress: () => {
            // Redux store'u temizle
            dispatch(clearUser())
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }

  return <ProfileMenuItem icon="mdi:logout" title="Çıkış Yap" onPress={handleLogout} color={Colors.status.error} />
}

export default LogoutButton
