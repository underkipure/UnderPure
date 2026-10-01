<?php

require_once __DIR__ . "/services/AuthRegisterService.php";
require_once __DIR__ . "/services/AuthLoginService.php";
require_once __DIR__ . "/services/AuthProfileService.php";
require_once __DIR__ . "/services/AuthPasswordResetService.php";

class AuthController {
    private $pdo;
    private $registerService;
    private $loginService;
    private $profileService;
    private $passwordResetService;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->registerService      = new AuthRegisterService($pdo);
        $this->loginService         = new AuthLoginService($pdo);
        $this->profileService       = new AuthProfileService($pdo);
        $this->passwordResetService = new AuthPasswordResetService($pdo);
    }

    /**
     * POST /api/auth/register
     */
    public function register() {
        $this->registerService->register();
    }

    /**
     * POST /api/auth/login
     */
    public function login() {
        $this->loginService->login();
    }

    /**
     * GET /api/auth/me
     */
    public function me() {
        $this->profileService->me();
    }

    /**
     * PUT /api/auth/profile
     */
    public function updateProfile() {
        $this->profileService->updateProfile();
    }

    /**
     * PUT /api/auth/password
     */
    public function updatePassword() {
        $this->profileService->updatePassword();
    }

    /**
     * POST /api/auth/google
     */
    public function googleLogin() {
        $this->loginService->googleLogin();
    }

    /**
     * POST /api/auth/forgot-password
     */
    public function forgotPassword() {
        $this->passwordResetService->forgotPassword();
    }

    /**
     * POST /api/auth/reset-password
     */
    public function resetPassword() {
        $this->passwordResetService->resetPassword();
    }

    /**
     * POST /api/auth/verify-otp
     */
    public function verifyOtpAndLogin() {
        $this->loginService->verifyOtpAndLogin();
    }

    /**
     * POST /api/auth/logout-all
     */
    public function logoutAll() {
        $this->loginService->logoutAll();
    }
}
