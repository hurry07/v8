function render(mesh, textureframe, material) {
    material.bindTexture(textureframe);
    material.bindMesh(mesh);
    mesh.draw();
}