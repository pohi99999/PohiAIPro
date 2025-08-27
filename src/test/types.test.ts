import { describe, it, expect } from 'vitest'
import { DemandStatus, StockStatus, UserRole } from '../../types'

describe('Types', () => {
  describe('DemandStatus', () => {
    it('should have correct enum values', () => {
      expect(DemandStatus.RECEIVED).toBe('Received')
      expect(DemandStatus.PROCESSING).toBe('Processing')
      expect(DemandStatus.COMPLETED).toBe('Completed')
      expect(DemandStatus.CANCELLED).toBe('Cancelled')
    })
  })

  describe('StockStatus', () => {
    it('should have correct enum values', () => {
      expect(StockStatus.AVAILABLE).toBe('Available')
      expect(StockStatus.RESERVED).toBe('Reserved')
      expect(StockStatus.SOLD).toBe('Sold')
    })
  })

  describe('UserRole', () => {
    it('should have correct enum values', () => {
      expect(UserRole.ADMIN).toBe('Administrator')
      expect(UserRole.CUSTOMER).toBe('Customer')
      expect(UserRole.MANUFACTURER).toBe('Manufacturer')
    })
  })
})