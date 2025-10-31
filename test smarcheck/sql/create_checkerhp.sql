-- Create database and tables for Checkerhp (safe to run multiple times)
CREATE DATABASE IF NOT EXISTS `Checkerhp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `Checkerhp`;

-- merk
CREATE TABLE IF NOT EXISTS `merk` (
  `id_merk` INT NOT NULL PRIMARY KEY,
  `nama_merk` VARCHAR(255) NOT NULL,
  `negara_asal` VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- kategori
CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` INT NOT NULL PRIMARY KEY,
  `nama_kategori` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- produk
CREATE TABLE IF NOT EXISTS `produk` (
  `id_produk` INT NOT NULL PRIMARY KEY,
  `id_merk` INT,
  `id_kategori` INT,
  `nama_produk` VARCHAR(255) NOT NULL,
  `tahun_rilis` YEAR NULL,
  FOREIGN KEY (id_merk) REFERENCES merk(id_merk) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- id_seri
CREATE TABLE IF NOT EXISTS `id_seri` (
  `id_seri` INT NOT NULL PRIMARY KEY,
  `id_produk` INT,
  `nama_seri` VARCHAR(255),
  `model` VARCHAR(100),
  `harga` DECIMAL(15,2) DEFAULT 0,
  FOREIGN KEY (id_produk) REFERENCES produk(id_produk) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional other tables omitted (stok, user, dll)

-- Insert sample data (from checkerhp.csv)
INSERT INTO `merk` (`id_merk`,`nama_merk`,`negara_asal`) VALUES
(1,'Samsung','Korea Selatan'),
(2,'Apple','Amerika Serikat'),
(3,'Xiaomi','China')
ON DUPLICATE KEY UPDATE nama_merk=VALUES(nama_merk), negara_asal=VALUES(negara_asal);

INSERT INTO `kategori` (`id_kategori`,`nama_kategori`) VALUES
(1,'Smartphone'),
(2,'Tablet'),
(3,'Laptop')
ON DUPLICATE KEY UPDATE nama_kategori=VALUES(nama_kategori);

INSERT INTO `produk` (`id_produk`,`id_merk`,`id_kategori`,`nama_produk`,`tahun_rilis`) VALUES
(1,1,1,'Samsung Galaxy S21','2021'),
(2,2,1,'iPhone 13','2021'),
(3,3,1,'Xiaomi Redmi Note 11','2022')
ON DUPLICATE KEY UPDATE id_merk=VALUES(id_merk), id_kategori=VALUES(id_kategori), nama_produk=VALUES(nama_produk), tahun_rilis=VALUES(tahun_rilis);

INSERT INTO `id_seri` (`id_seri`,`id_produk`,`nama_seri`,`model`,`harga`) VALUES
(1,1,'Galaxy S21 Series','SM-G991B',12000000.00),
(2,2,'iPhone 13 Series','A2633',15000000.00),
(3,3,'Redmi Note 11 Series','21091116AG',3500000.00)
ON DUPLICATE KEY UPDATE id_produk=VALUES(id_produk), nama_seri=VALUES(nama_seri), model=VALUES(model), harga=VALUES(harga);

-- Quick check: show tables (not executed here)
-- SHOW TABLES;
