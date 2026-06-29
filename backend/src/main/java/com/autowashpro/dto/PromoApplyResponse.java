package com.autowashpro.dto;

/** Ket qua kiem tra / xem truoc khi khach ap dung ma khuyen mai. */
public class PromoApplyResponse {

    private boolean valid;
    private String code;
    private String name;
    private int discountPercent;
    private long basePrice;
    private long discountAmount;
    private long finalPrice;
    private String message;

    public PromoApplyResponse(boolean valid, String code, String name, int discountPercent,
                              long basePrice, long discountAmount, long finalPrice, String message) {
        this.valid = valid;
        this.code = code;
        this.name = name;
        this.discountPercent = discountPercent;
        this.basePrice = basePrice;
        this.discountAmount = discountAmount;
        this.finalPrice = finalPrice;
        this.message = message;
    }

    public static PromoApplyResponse ok(String code, String name, int discountPercent,
                                        long basePrice, long discountAmount, long finalPrice) {
        return new PromoApplyResponse(true, code, name, discountPercent, basePrice, discountAmount, finalPrice,
                "Áp dụng mã thành công");
    }

    public static PromoApplyResponse fail(long basePrice, String message) {
        return new PromoApplyResponse(false, null, null, 0, basePrice, 0, basePrice, message);
    }

    public boolean isValid() {
        return valid;
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public long getBasePrice() {
        return basePrice;
    }

    public long getDiscountAmount() {
        return discountAmount;
    }

    public long getFinalPrice() {
        return finalPrice;
    }

    public String getMessage() {
        return message;
    }
}
