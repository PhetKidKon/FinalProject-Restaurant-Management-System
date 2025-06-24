package com.javaapi.java_api.payload.response;

public class IngredientUsage {
    private String ingredientName;
    private int quantityUsed;

    public IngredientUsage(String ingredientName, int quantityUsed) {
        this.ingredientName = ingredientName;
        this.quantityUsed = quantityUsed;
    }

    public String getIngredientName() {
        return ingredientName;
    }

    public void setIngredientName(String ingredientName) {
        this.ingredientName = ingredientName;
    }

    public int getQuantityUsed() {
        return quantityUsed;
    }

    public void setQuantityUsed(int quantityUsed) {
        this.quantityUsed = quantityUsed;
    }
}
