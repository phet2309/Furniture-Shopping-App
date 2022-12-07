CREATE DATABASE desksrus;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE CUSTOMER (
    CID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    FName varchar(255) NOT NULL,
    LName varchar(255) NOT NULL,
    CustStatus varchar(255) NOT NULL DEFAULT 'Bronze',
    Email varchar(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    CustAddress varchar(255),
    Phone text,
    UserType VARCHAR(255) NOT NULL DEFAULT 'User'
);

CREATE TABLE SILVER_AND_ABOVE(
    CID uuid,
    CreditLine int,
    PRIMARY KEY(CID),
    CONSTRAINT FK_Silver FOREIGN KEY (CID)REFERENCES Customer(CID)
);

CREATE TABLE Credit_Card(
   CardNumber int NOT NULL,
   SecNumber int NOT NULL,
   CardOwnerName varchar(255) NOT NULL,
   CardType varchar(255) NOT NULL,
   BillingAddress varchar(255) NOT NULL,
   ExpDate date NOT NULL,
   PRIMARY KEY (CardNumber)
);

CREATE TABLE Stored_Card(
    CardNumber int NOT NULL,
    CID uuid NOT NULL,
    PRIMARY KEY(CardNumber,CID), 
    CONSTRAINT FK_Stored FOREIGN KEY (CID)REFERENCES Customer(CID)
);

ALTER TABLE stored_card
ADD FOREIGN KEY(CardNumber) REFERENCES Credit_Card(CardNumber);

CREATE TABLE SHIP_ADDRESS(
	CID uuid NOT NULL,
    SAName varchar(255) NOT NULL,
    SNumber int,
    Country varchar(255) NOT NULL,
    State varchar(255) NOT NULL,
    City varchar(255) NOT NULL,
    Street varchar(255) NOT NULL,
    ZIP int NOT NULL,
    RecipientName varchar(255),
    PRIMARY KEY(CID, SAName),
    FOREIGN KEY(CID)
    	REFERENCES Customer(CID)
    	ON DELETE CASCADE
);



CREATE TABLE TRANSACTION(
	TransactionID int NOT NULL,
    TStatus varchar(255) NOT NULL,
    TDate date NOT NULL,
    TotalAmount int NOT NULL,
    CardNumber int NOT NULL,
    CID uuid NOT NULL,
    PRIMARY KEY(TransactionID),
    FOREIGN KEY(CardNumber)
    	REFERENCES credit_card(CardNumber)
    	ON DELETE CASCADE,
    FOREIGN KEY(CID)
    	REFERENCES Customer(CID)
    	ON DELETE CASCADE
);

CREATE TABLE CART(
	CartID int NOT NULL,
    TransactionID int NOT NULL,
    Status varchar(255) NOT NULL,
    Date date NOT NULL,
    TotalAmount int NOT NULL,
    ShipAddName varchar(255) NOT NULL,
    CID uuid NOT NULL,
    PRIMARY KEY(CartID),
    FOREIGN KEY(CID, ShipAddName)
    	REFERENCES ship_address(CID, SAName)
    	ON DELETE CASCADE,
    FOREIGN KEY(CID) 
        REFERENCES Customer(CID)
        ON DELETE CASCADE,
    FOREIGN KEY(TransactionID)
    	REFERENCES TRANSACTION(TransactionID)
    	ON DELETE CASCADE
);

CREATE TABLE Product(
	ProductID int NOT NULL,
    Name varchar(255) NOT NULL,
    Price int NOT NULL,
    Type varchar(255) NOT NULL,
    Quantity int NOT NULL,
    Description varchar(255),
    PRIMARY KEY(ProductID)
);

CREATE TABLE Appears_in(
  CartID int NOT NULL,
  ProductID int NOT NULL,
  Quantity int NOT NULL,
  PriceSold int NOT NULL,
  PRIMARY KEY(CartID, ProductID),
  FOREIGN KEY(CartID)
    	REFERENCES cart(CartID)
    	ON DELETE CASCADE,
    FOREIGN KEY(ProductID)
    	REFERENCES product(ProductID)
    	ON DELETE CASCADE
);

CREATE TABLE Offer_Product(
  ProductID int NOT NULL,
  OfferPrice int NOT NULL,
  PRIMARY KEY(ProductID),
  FOREIGN KEY(ProductID)
    	REFERENCES product(ProductID)
    	ON DELETE CASCADE
);

CREATE TABLE Desks(
  ProductID int NOT NULL,
  Material varchar(100),
  Drawers int,
  PRIMARY KEY(ProductID),
  FOREIGN KEY(ProductID)
    	REFERENCES product(ProductID)
    	ON DELETE CASCADE
);

CREATE TABLE Chairs(
  ProductID int NOT NULL,
  Fabric varchar(100),
  Type varchar(100),
  PRIMARY KEY(ProductID),
  FOREIGN KEY(ProductID)
    	REFERENCES product(ProductID)
    	ON DELETE CASCADE
);

CREATE TABLE Book_Cases(
  ProductID int NOT NULL,
  Material varchar(100),
  Shelves int,
  PRIMARY KEY(ProductID),
  FOREIGN KEY(ProductID)
    	REFERENCES product(ProductID)
    	ON DELETE CASCADE
);