export interface CallRecord {
  id: string
  callerName: string
  callerNumber: string
  receiverNumber: string
  city: string
  callDirection: boolean
  callStatus: boolean
  callDuration: number
  callCost: string
  callStartTime: string
  callEndTime: string
}

export type CallRecordResponse = CallRecord[]