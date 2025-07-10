import { configureStore } from "@reduxjs/toolkit";
import callTrackingReducer from "./slices/callTrackingSlice";
import callSlice from "./slices/callSlice";
import callChatSlice from "./slices/callChatSlice";
import registerRepresentativeSlice from "./slices/registerRepresentativeSlice";
import registerPatientSlice from "./slices/registerPatientSlice";
import linkManagementSlice from "./slices/linkManagementeSlice";
import profileSlice from "./slices/profileSlice";
import pendingsSlice from "./slices/pendingsSlice";
import diagnosticSlice from "./slices/diagnosticSlice";
import basicSlice from "./slices/basicSlice";
import manageFileSlice from "./slices/manageFileSlice";
import logisticsSlice from "./slices/logisticsSlice";
import blockedUserSlice from "./slices/blockedUserSlice";

export const store = configureStore({
  reducer: {
    callTracking: callTrackingReducer,
    call: callSlice,
    callChat: callChatSlice,
    registerRepresentative: registerRepresentativeSlice,
    registerPatient: registerPatientSlice,
    linkManagement: linkManagementSlice,
    profile: profileSlice,
    pending: pendingsSlice,
    diagnostic: diagnosticSlice,
    basic: basicSlice,
    manageFile: manageFileSlice,
    logistics: logisticsSlice,
    blockedUsers: blockedUserSlice,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;