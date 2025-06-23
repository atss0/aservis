import { API_URL } from "@env"

export const BASE_URL = API_URL || "http://192.168.1.101:8000/api"

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

export const API_CONFIG = {
  BASE_URL,
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  RETRY_ATTEMPTS: 3,
} as const

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    LOGOUT: "/auth/logout",
  },
  PARENT: {
    PROFILE: "/parent/profile",
    CHILDREN: "/parent/children",
  },
  DRIVER: {
    PROFILE: "/driver/profile",
    ROUTES: "/driver/routes",
    HISTORY: "/driver/history",
    REPORTS: "/driver/reports",
  },
  BUS: {
    LOCATION: "/bus/location",
    STATUS: "/bus/status",
  },
  ROUTES: {
    DETAILS: "/routes",
  },
  NOTIFICATIONS: {
    LIST: "/notifications",
    READ: "/notifications",
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: "/notifications",
  },
  TRIPS: {
    HISTORY: "/trips",
    DETAIL: "/trips",
  },
  PAYMENTS: {
    LIST: "/payments",
    DETAIL: "/payments",
    PAY: "/payments",
  },
  SETTINGS: {
    GET: "/settings",
    UPDATE: "/settings",
  },
} as const
