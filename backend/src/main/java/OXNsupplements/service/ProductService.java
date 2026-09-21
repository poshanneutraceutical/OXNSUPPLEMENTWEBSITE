package OXNsupplements.service;

import OXNsupplements.dto.ProductDTO;

import OXNsupplements.entity.Product;

import OXNsupplements.repository.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;


    public List<ProductDTO> getAllProducts() {

        return productRepository.findAllOrdered()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }



    public ProductDTO getProductById(Long id) {

        Product p = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: " + id
                        ));

        return toDTO(p);
    }



    public ProductDTO createProduct(ProductDTO dto) {

        Product p = toEntity(dto);

        Product saved = productRepository.save(p);

        return toDTO(saved);
    }



    public ProductDTO updateProduct(
            Long id,
            OXNsupplements.dto.ProductDTO dto) {


        Product existing = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found: " + id
                        ));


        existing.setName(dto.getName());

        existing.setPrice(dto.getPrice());

        existing.setDescription(dto.getDescription());

        existing.setCategory(dto.getCategory());

        existing.setBadge(dto.getBadge());

        existing.setFeatured(dto.getFeatured());

        existing.setInStock(dto.getInStock());


        return toDTO(
                productRepository.save(existing)
        );
    }




    public void deleteProduct(Long id) {

        productRepository.deleteById(id);

    }





    private ProductDTO toDTO(Product p) {

        return ProductDTO.builder()

                .id(p.getId())

                .name(p.getName())

                .price(p.getPrice())

                .description(p.getDescription())

                .category(p.getCategory())

                .badge(p.getBadge())

                .featured(p.getFeatured())

                .inStock(p.getInStock())

                .build();
    }





    private Product toEntity(ProductDTO dto) {

        return Product.builder()

                .name(dto.getName())

                .price(dto.getPrice())

                .description(dto.getDescription())

                .category(dto.getCategory())

                .badge(dto.getBadge())

                .featured(
                        dto.getFeatured() != null
                                ? dto.getFeatured()
                                : false
                )

                .inStock(
                        dto.getInStock() != null
                                ? dto.getInStock()
                                : true
                )

                .build();
    }
}

